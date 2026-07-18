import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { WebSocketServer, WebSocket } from "ws";
import { ed25519 } from "@noble/curves/ed25519.js";
import { hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { createPersistence } from "./persistence.js";
import { notify } from "./push.js";

const PORT = Number(process.env.PORT ?? 48080);
const HOST = process.env.HOST ?? "0.0.0.0";
const MAX_PAYLOAD = 64 * 1024;
const MAX_QUEUE = 1000;

const HEX64 = /^[0-9a-f]{64}$/;
const EXPO_TOKEN = /^Expo(nent)?PushToken\[[^\]]+\]$/;

const sockets = new Map();

const { queues, tokens, save, flush } = createPersistence();

for (const [pk, items] of queues) {
  queues.set(
    pk,
    items.map((item) => ({
      mid: item.mid ?? randomBytes(8).toString("hex"),
      from: item.from,
      env: item.env,
    })),
  );
}

const register = (publicKey, ws) => {
  let set = sockets.get(publicKey);
  if (!set) {
    set = new Set();
    sockets.set(publicKey, set);
  }
  set.add(ws);
};

const unregister = (publicKey, ws) => {
  const set = sockets.get(publicKey);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) sockets.delete(publicKey);
};

const verifyAuth = (publicKey, nonce, signature) => {
  try {
    return ed25519.verify(
      hexToBytes(signature),
      utf8ToBytes(nonce),
      hexToBytes(publicKey),
    );
  } catch {
    return false;
  }
};

const sendFrame = (ws, frame) => {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(frame));
};

const deliver = (to, from, env) => {
  const mid = randomBytes(8).toString("hex");
  const item = { mid, from, env };

  const queue = queues.get(to) ?? [];
  queue.push(item);
  if (queue.length > MAX_QUEUE) queue.shift();
  queues.set(to, queue);
  save();

  const set = sockets.get(to);
  if (set && set.size > 0) {
    for (const ws of set) sendFrame(ws, { type: "message", from, env, mid });
  } else {
    void notify(to, tokens.get(to));
  }
};

const flushQueue = (publicKey, ws) => {
  const queue = queues.get(publicKey);
  if (!queue || queue.length === 0) return;
  for (const item of queue) {
    sendFrame(ws, { type: "message", from: item.from, env: item.env, mid: item.mid });
  }
};

const acknowledge = (publicKey, mid) => {
  const queue = queues.get(publicKey);
  if (!queue) return;
  const next = queue.filter((item) => item.mid !== mid);
  if (next.length === queue.length) return;
  if (next.length === 0) queues.delete(publicKey);
  else queues.set(publicKey, next);
  save();
};

const landing = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "landing.html"),
);

const server = createServer((req, res) => {
  if (req.method === "GET" && (req.headers.accept ?? "").includes("text/html")) {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(landing);
    return;
  }
  res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  res.end("BeHide relay OK\n");
});

const wss = new WebSocketServer({ server, maxPayload: MAX_PAYLOAD });

wss.on("connection", (ws) => {
  const nonce = randomBytes(16).toString("hex");
  let publicKey = null;

  sendFrame(ws, { type: "challenge", nonce });

  ws.on("message", (data) => {
    let frame;
    try {
      frame = JSON.parse(data.toString());
    } catch {
      return;
    }

    if (!publicKey) {
      if (frame.type !== "auth") return;

      const { publicKey: pk, nonce: n, signature } = frame;
      if (typeof pk !== "string" || !HEX64.test(pk)) return ws.close();
      if (n !== nonce || typeof signature !== "string") return ws.close();
      if (!verifyAuth(pk, n, signature)) return ws.close();

      publicKey = pk;
      register(publicKey, ws);
      sendFrame(ws, { type: "ready" });
      flushQueue(publicKey, ws);
      return;
    }

    if (frame.type === "send") {
      const { to, env } = frame;
      if (typeof to !== "string" || !HEX64.test(to) || env == null) return;
      deliver(to, publicKey, env);
      return;
    }

    if (frame.type === "ack") {
      if (typeof frame.mid === "string") acknowledge(publicKey, frame.mid);
      return;
    }

    if (frame.type === "push-token") {
      if (typeof frame.token === "string" && EXPO_TOKEN.test(frame.token)) {
        tokens.set(publicKey, frame.token);
        save();
      }
    }
  });

  ws.on("close", () => {
    if (publicKey) unregister(publicKey, ws);
  });

  ws.on("error", () => {});
});

server.listen(PORT, HOST, () => {
  console.log(`BeHide relay listening on ${HOST}:${PORT}`);
});

const shutdown = () => {
  flush();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
