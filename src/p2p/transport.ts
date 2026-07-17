import type { Envelope } from "./envelope";

export type IncomingMessage = {
  from: string;
  envelope: Envelope;
  mid?: string;
};

export type TransportState = "disconnected" | "connecting" | "connected";

export type Transport = {
  connect: () => void;
  disconnect: () => void;
  send: (to: string, envelope: Envelope) => void;
  ack: (mid: string) => void;
  setPushToken: (token: string | null) => void;
  onMessage: (handler: (message: IncomingMessage) => void) => () => void;
  onStatusChange: (handler: (state: TransportState) => void) => () => void;
};

export type RelayConfig = {
  url: string;
  publicKey: string;
  sign: (message: string) => string | null;
};

const RECONNECT_STEPS = [1000, 2000, 5000, 10000, 30000];

export const createRelayTransport = (config: RelayConfig): Transport => {
  let ws: WebSocket | null = null;
  let state: TransportState = "disconnected";
  let ready = false;
  let wantConnection = false;
  let reconnectAttempt = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const outbox: { to: string; envelope: Envelope }[] = [];

  let pushToken: string | null = null;

  const messageHandlers = new Set<(message: IncomingMessage) => void>();
  const statusHandlers = new Set<(state: TransportState) => void>();

  const setState = (next: TransportState) => {
    if (state === next) return;
    state = next;
    statusHandlers.forEach((handler) => handler(next));
  };

  const rawSend = (payload: unknown) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  };

  const flushOutbox = () => {
    while (outbox.length > 0) {
      const item = outbox.shift();
      if (item) rawSend({ type: "send", to: item.to, env: item.envelope });
    }
  };

  const sendPushToken = () => {
    if (ready && pushToken) rawSend({ type: "push-token", token: pushToken });
  };

  const scheduleReconnect = () => {
    if (!wantConnection || reconnectTimer) return;
    const delay =
      RECONNECT_STEPS[Math.min(reconnectAttempt, RECONNECT_STEPS.length - 1)];
    reconnectAttempt += 1;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      openSocket();
    }, delay);
  };

  const handleServerFrame = (raw: string) => {
    let frame: {
      type?: string;
      nonce?: string;
      from?: string;
      env?: Envelope;
      mid?: string;
    };
    try {
      frame = JSON.parse(raw);
    } catch {
      return;
    }

    switch (frame.type) {
      case "challenge": {
        const signature = frame.nonce ? config.sign(frame.nonce) : null;
        if (!signature) {
          disconnect();
          return;
        }
        rawSend({
          type: "auth",
          publicKey: config.publicKey,
          nonce: frame.nonce,
          signature,
        });
        return;
      }
      case "ready": {
        ready = true;
        reconnectAttempt = 0;
        setState("connected");
        flushOutbox();
        sendPushToken();
        return;
      }
      case "message": {
        if (frame.from && frame.env) {
          const incoming: IncomingMessage = {
            from: frame.from,
            envelope: frame.env,
            mid: frame.mid,
          };
          messageHandlers.forEach((handler) => handler(incoming));
        }
        return;
      }
      default:
        return;
    }
  };

  const openSocket = () => {
    if (!config.url) return;
    if (ws) return;

    setState("connecting");
    const socket = new WebSocket(config.url);
    ws = socket;

    socket.onmessage = (event) => handleServerFrame(String(event.data));

    socket.onclose = () => {
      if (ws === socket) ws = null;
      ready = false;
      setState("disconnected");
      scheduleReconnect();
    };

    socket.onerror = () => {};
  };

  const connect = () => {
    wantConnection = true;
    reconnectAttempt = 0;
    openSocket();
  };

  const disconnect = () => {
    wantConnection = false;
    ready = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      ws.onclose = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.close();
      ws = null;
    }
    setState("disconnected");
  };

  const send = (to: string, envelope: Envelope) => {
    if (ready && ws && ws.readyState === WebSocket.OPEN) {
      rawSend({ type: "send", to, env: envelope });
    } else {
      outbox.push({ to, envelope });
    }
  };

  const ack = (mid: string) => {
    rawSend({ type: "ack", mid });
  };

  const setPushToken = (token: string | null) => {
    pushToken = token;
    sendPushToken();
  };

  const onMessage = (handler: (message: IncomingMessage) => void) => {
    messageHandlers.add(handler);
    return () => messageHandlers.delete(handler);
  };

  const onStatusChange = (handler: (state: TransportState) => void) => {
    statusHandlers.add(handler);
    return () => statusHandlers.delete(handler);
  };

  return {
    connect,
    disconnect,
    send,
    ack,
    setPushToken,
    onMessage,
    onStatusChange,
  };
};
