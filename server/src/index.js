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
const MAX_PAYLOAD = 256 * 1024;
const MAX_QUEUE = 1000;
const MAX_QUEUE_BYTES = 64 * 1024 * 1024;
const HEARTBEAT_MS = Number(process.env.HEARTBEAT_MS ?? 30000);

const HEX64 = /^[0-9a-f]{64}$/;
const EXPO_TOKEN = /^Expo(nent)?PushToken\[[^\]]+\]$/;

const sockets = new Map();

const { queues, tokens, save, flush } = createPersistence();

const queueBytes = new Map();

const sizeOf = (env) => JSON.stringify(env).length;

const totalOf = (queue) => queue.reduce((sum, item) => sum + item.bytes, 0);

for (const [pk, items] of queues) {
  const restored = items.map((item) => ({
    mid: item.mid ?? randomBytes(8).toString("hex"),
    from: item.from,
    env: item.env,
    bytes: item.bytes ?? sizeOf(item.env),
  }));
  queues.set(pk, restored);
  queueBytes.set(pk, totalOf(restored));
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

const liveSockets = (publicKey) => {
  const set = sockets.get(publicKey);
  if (!set) return [];
  return [...set].filter((ws) => ws.readyState === WebSocket.OPEN);
};

const deliver = (to, from, env) => {
  const mid = randomBytes(8).toString("hex");
  const item = { mid, from, env, bytes: sizeOf(env) };

  const queue = queues.get(to) ?? [];
  queue.push(item);

  let total = (queueBytes.get(to) ?? 0) + item.bytes;
  while (
    queue.length > MAX_QUEUE ||
    (queue.length > 1 && total > MAX_QUEUE_BYTES)
  ) {
    total -= queue.shift().bytes;
  }

  queues.set(to, queue);
  queueBytes.set(to, total);
  save();

  const live = liveSockets(to);
  if (live.length > 0) {
    for (const ws of live) sendFrame(ws, { type: "message", from, env, mid });
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

  if (next.length === 0) {
    queues.delete(publicKey);
    queueBytes.delete(publicKey);
  } else {
    queues.set(publicKey, next);
    queueBytes.set(publicKey, totalOf(next));
  }
  save();
};

const landing = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "landing.html"),
);

const SITE = "https://behide.xeron.be";

const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc></url>
</urlset>
`;

const server = createServer((req, res) => {
  const path = (req.url ?? "/").split("?")[0].replace(/\/+$/, "") || "/";
  const readable = req.method === "GET" || req.method === "HEAD";

  if (!readable) {
    res.writeHead(405, { "content-type": "text/plain; charset=utf-8", allow: "GET, HEAD" });
    res.end("Method not allowed\n");
    return;
  }

  if (path === "/robots.txt") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end(robots);
    return;
  }

  if (path === "/sitemap.xml") {
    res.writeHead(200, { "content-type": "application/xml; charset=utf-8" });
    res.end(sitemap);
    return;
  }

  if (path === "/health") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end("BeHide relay OK\n");
    return;
  }

  if (path === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(landing);
    return;
  }

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Not found\n");
});

const wss = new WebSocketServer({ server, maxPayload: MAX_PAYLOAD });

const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) {
      ws.terminate();
      continue;
    }
    ws.isAlive = false;
    ws.ping();
  }
}, HEARTBEAT_MS);

wss.on("close", () => clearInterval(heartbeat));

wss.on("connection", (ws) => {
  const nonce = randomBytes(16).toString("hex");
  let publicKey = null;

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

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

    if (frame.type === "ping") {
      sendFrame(ws, { type: "pong" });
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
