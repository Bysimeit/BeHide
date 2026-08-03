import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";
import * as Crypto from "expo-crypto";
import { formatFingerprint } from "../auth/identity";
import { useTranslate } from "../i18n";
import { useAuth } from "../auth/AuthContext";
import {
  createRelayTransport,
  type IncomingMessage,
  type Transport,
  type TransportState,
} from "../p2p/transport";
import {
  presentMessageNotification,
  registerForPushToken,
} from "../notifications/push";
import type { CallSignal } from "../p2p/signaling";
import {
  MAX_MEDIA_BYTES,
  MEDIA_CHUNK_CHARS,
  RELAY_URL,
} from "../constants/config";
import { base64ToBytes, bytesToBase64 } from "../media/base64";
import {
  clearMediaCache,
  deleteMedia,
  readMedia,
  readSource,
  storeMedia,
} from "../media/files";
import type { PickedMedia } from "../media/picker";
import type {
  Call,
  Contact,
  ContactStats,
  Conversation,
  MediaStatus,
  Message,
  MessageMedia,
} from "../types";
import {
  loadAll,
  putCall,
  putContact,
  putMessage,
  removeCalls,
  removeContacts,
  removeMessages,
} from "./db";
import {
  exportBackup as writeBackupFile,
  mergeBackup,
  pickBackup,
  type BackupError,
} from "./backup";
import {
  DEFAULT_SETTINGS,
  readSettings,
  writeSettings,
  type Settings,
} from "./settings";

export type BackupOutcome =
  | { status: "done"; imported?: number }
  | { status: "cancelled" }
  | { status: "locked" }
  | { status: "unavailable" }
  | { status: "failed"; error: BackupError };

type ChatPayload = { kind: "message"; id: string; body: string; sentAt: string };
type MediaStartPayload = {
  kind: "media-start";
  id: string;
  body: string;
  sentAt: string;
  media: MessageMedia;
  chunks: number;
};
type MediaChunkPayload = {
  kind: "media-chunk";
  id: string;
  index: number;
  data: string;
};
type SignalPayload = { kind: "signal"; signal: CallSignal };
type ReceiptPayload = { kind: "receipt"; ids: string[]; readAt: string };
type WirePayload =
  | ChatPayload
  | MediaStartPayload
  | MediaChunkPayload
  | SignalPayload
  | ReceiptPayload;

const CHUNK_BYTES = (MEDIA_CHUNK_CHARS * 3) / 4;
const MAX_CHUNKS = Math.ceil(MAX_MEDIA_BYTES / CHUNK_BYTES) + 1;
const MAX_ACTIVE_TRANSFERS = 4;
const MAX_MIME_LENGTH = 100;
const PROGRESS_STEP = 0.02;

const positive = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;

const normalizeMedia = (media: MessageMedia): MessageMedia => ({
  kind: media.kind,
  mime:
    media.mime.length > 0 && media.mime.length <= MAX_MIME_LENGTH
      ? media.mime
      : "application/octet-stream",
  bytes: positive(media.bytes),
  width: positive(media.width),
  height: positive(media.height),
  durationMs: positive(media.durationMs) || undefined,
});

type Transfer = {
  message: Message;
  total: number;
  parts: (string | null)[];
  received: number;
  mids: Set<string>;
};

type AppDataValue = {
  contacts: Contact[];
  conversations: Conversation[];
  calls: Call[];
  connection: TransportState;
  mediaProgress: Record<string, number>;
  contactById: (id: string) => Contact | null;
  conversationById: (id: string) => Conversation | null;
  messageById: (id: string) => Message | null;
  messagesOf: (contactId: string) => Message[];
  statsOf: (contactId: string) => ContactStats;
  addContact: (input: {
    firstName: string;
    lastName?: string;
    publicKey: string;
    exchangePublicKey: string;
  }) => Contact;
  toggleBlockContact: (id: string) => void;
  removeContact: (id: string) => void;
  sendMessage: (contactId: string, body: string) => void;
  sendMedia: (
    contactId: string,
    picked: PickedMedia,
    body: string,
  ) => Promise<void>;
  retryMedia: (messageId: string) => Promise<void>;
  markConversationRead: (contactId: string) => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  exportBackup: () => Promise<BackupOutcome>;
  importBackup: () => Promise<BackupOutcome>;
  logCall: (
    contactId: string,
    durationSeconds: number,
    video: boolean,
  ) => Call;
  sendSignal: (contactId: string, signal: CallSignal) => void;
  onSignal: (handler: (from: Contact, signal: CallSignal) => void) => () => void;
};

const AppDataContext = createContext<AppDataValue | null>(null);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslate();
  const { status, storageKey, backupKey, identity, sign, sealFor, openFrom } =
    useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [connection, setConnection] = useState<TransportState>("disconnected");
  const [mediaProgress, setMediaProgress] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  const transportRef = useRef<Transport | null>(null);
  const signalHandlers = useRef(
    new Set<(from: Contact, signal: CallSignal) => void>(),
  );
  const transfers = useRef(new Map<string, Transfer>());
  const progressRef = useRef(new Map<string, number>());
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    void readSettings().then(setSettings);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void writeSettings(next).catch((error) =>
        console.warn("Écriture des réglages échouée :", error),
      );
      return next;
    });
  }, []);

  useEffect(() => {
    if (status !== "unlocked") {
      setContacts([]);
      setMessages([]);
      setCalls([]);
      setMediaProgress({});
      setLoaded(false);
      transfers.current.clear();
      progressRef.current.clear();
      void clearMediaCache();
      return;
    }

    const key = storageKey();
    if (!key) return;

    let cancelled = false;
    loadAll(key)
      .then((data) => {
        if (cancelled) return;
        setContacts(data.contacts);
        setMessages(data.messages);
        setCalls(data.calls);
        setLoaded(true);
      })
      .catch((error) => console.warn("Chargement local échoué :", error));

    return () => {
      cancelled = true;
    };
  }, [status, storageKey]);

  const persist = useCallback(
    (write: (key: Uint8Array) => Promise<void>) => {
      const key = storageKey();
      if (!key) return;
      void write(key).catch((error) =>
        console.warn("Écriture locale échouée :", error),
      );
    },
    [storageKey],
  );

  const reportProgress = useCallback((id: string, ratio: number) => {
    const value = Math.min(1, Math.max(0, ratio));
    const previous = progressRef.current.get(id) ?? -1;
    if (value < 1 && value - previous < PROGRESS_STEP) return;
    progressRef.current.set(id, value);
    setMediaProgress((current) => ({ ...current, [id]: value }));
  }, []);

  const clearProgress = useCallback((id: string) => {
    progressRef.current.delete(id);
    setMediaProgress((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const setMediaStatus = useCallback(
    (message: Message, mediaStatus: MediaStatus) => {
      setMessages((current) =>
        current.map((m) => (m.id === message.id ? { ...m, mediaStatus } : m)),
      );
      const known =
        messagesRef.current.find((m) => m.id === message.id) ?? message;
      persist((key) => putMessage(key, { ...known, mediaStatus }));
    },
    [persist],
  );

  const completeTransfer = useCallback(
    async (transfer: Transfer) => {
      const { message } = transfer;
      const key = storageKey();
      const bytes = key ? base64ToBytes(transfer.parts.join("")) : null;
      const stored = key && bytes ? await storeMedia(key, message.id, bytes) : false;

      clearProgress(message.id);
      setMediaStatus(message, stored ? "ready" : "failed");
      transfer.mids.forEach((mid) => transportRef.current?.ack(mid));
    },
    [storageKey, clearProgress, setMediaStatus],
  );

  const handleIncoming = (incoming: IncomingMessage) => {
    const contact = contacts.find((c) => c.publicKey === incoming.from);
    if (!contact) return;

    const plaintext = openFrom(
      contact.publicKey,
      contact.exchangePublicKey,
      incoming.envelope,
    );
    if (!plaintext) return;

    const ack = () => {
      if (incoming.mid) transportRef.current?.ack(incoming.mid);
    };

    let payload: WirePayload;
    try {
      payload = JSON.parse(plaintext) as WirePayload;
    } catch {
      ack();
      return;
    }

    if (contact.blockedByMeAt !== null) {
      ack();
      return;
    }

    if (payload.kind === "signal") {
      signalHandlers.current.forEach((handler) =>
        handler(contact, payload.signal),
      );
    } else if (payload.kind === "receipt") {
      if (settings.readReceipts) {
        const read = new Set(payload.ids);
        setMessages((current) =>
          current.map((m) =>
            m.isOwn && read.has(m.id) && !m.readAt
              ? { ...m, readAt: payload.readAt }
              : m,
          ),
        );
        persist(async (key) => {
          for (const m of messages) {
            if (m.isOwn && read.has(m.id) && !m.readAt) {
              await putMessage(key, { ...m, readAt: payload.readAt });
            }
          }
        });
      }
    } else if (payload.kind === "media-start") {
      const incomingMedia = payload.media;
      if (
        !incomingMedia ||
        (incomingMedia.kind !== "image" && incomingMedia.kind !== "video") ||
        typeof incomingMedia.mime !== "string" ||
        typeof payload.id !== "string" ||
        !Number.isInteger(payload.chunks) ||
        payload.chunks < 1 ||
        payload.chunks > MAX_CHUNKS
      ) {
        ack();
        return;
      }

      const known = messagesRef.current.find((m) => m.id === payload.id);
      if (known?.mediaStatus === "ready") {
        ack();
        return;
      }

      const message: Message = {
        id: payload.id,
        conversationId: contact.id,
        isOwn: false,
        body: payload.body,
        sentAt: payload.sentAt,
        readAt: known?.readAt,
        media: normalizeMedia(incomingMedia),
        mediaStatus: "transferring",
      };

      setMessages((current) =>
        current.some((m) => m.id === message.id)
          ? current.map((m) => (m.id === message.id ? message : m))
          : [...current, message],
      );
      persist((key) => putMessage(key, message));

      const transfer: Transfer = {
        message,
        total: payload.chunks,
        parts: new Array<string | null>(payload.chunks).fill(null),
        received: 0,
        mids: new Set<string>(),
      };
      if (incoming.mid) transfer.mids.add(incoming.mid);

      if (
        transfers.current.size >= MAX_ACTIVE_TRANSFERS &&
        !transfers.current.has(payload.id)
      ) {
        const oldest = transfers.current.keys().next().value;
        if (oldest) transfers.current.delete(oldest);
      }

      transfers.current.set(payload.id, transfer);
      reportProgress(payload.id, 0);

      if (!known && AppState.currentState !== "active") {
        void presentMessageNotification(
          contact.publicKey,
          displayName(contact),
          t(
            incomingMedia.kind === "video"
              ? "notifications.newVideo"
              : "notifications.newPhoto",
          ),
        );
      }
      return;
    } else if (payload.kind === "media-chunk") {
      const transfer = transfers.current.get(payload.id);
      if (!transfer) {
        ack();
        return;
      }

      if (incoming.mid) transfer.mids.add(incoming.mid);

      if (
        Number.isInteger(payload.index) &&
        payload.index >= 0 &&
        payload.index < transfer.total &&
        transfer.parts[payload.index] === null &&
        typeof payload.data === "string"
      ) {
        transfer.parts[payload.index] = payload.data;
        transfer.received += 1;
        reportProgress(payload.id, transfer.received / transfer.total);
      }

      if (transfer.received < transfer.total) return;

      transfers.current.delete(payload.id);
      void completeTransfer(transfer);
      return;
    } else {
      const message: Message = {
        id: payload.id,
        conversationId: contact.id,
        isOwn: false,
        body: payload.body,
        sentAt: payload.sentAt,
      };
      let isNew = false;
      setMessages((current) => {
        if (current.some((m) => m.id === message.id)) return current;
        isNew = true;
        return [...current, message];
      });
      persist((key) => putMessage(key, message));

      if (isNew && AppState.currentState !== "active") {
        void presentMessageNotification(
          contact.publicKey,
          displayName(contact),
          t("notifications.newMessage"),
        );
      }
    }

    ack();
  };

  const incomingRef = useRef(handleIncoming);
  incomingRef.current = handleIncoming;

  useEffect(() => {
    if (status !== "unlocked" || !identity || !loaded) {
      setConnection("disconnected");
      return;
    }

    const transport = createRelayTransport({
      url: RELAY_URL,
      publicKey: identity.publicKey,
      sign,
    });
    transportRef.current = transport;

    const unsubMessage = transport.onMessage((message) =>
      incomingRef.current(message),
    );
    const unsubStatus = transport.onStatusChange(setConnection);
    transport.connect();

    void registerForPushToken().then((token) => {
      if (token) transport.setPushToken(token);
    });

    return () => {
      unsubMessage();
      unsubStatus();
      transport.disconnect();
      transportRef.current = null;
      setConnection("disconnected");
    };
  }, [status, identity, sign, loaded]);

  const byDate = (a: Message, b: Message) => a.sentAt.localeCompare(b.sentAt);

  const messagesOf = useCallback(
    (contactId: string) =>
      messages.filter((m) => m.conversationId === contactId).sort(byDate),
    [messages],
  );

  const conversations = useMemo<Conversation[]>(
    () =>
      contacts
        .map((contact) => {
          const thread = messages
            .filter((m) => m.conversationId === contact.id)
            .sort(byDate);

          const lastOwn = thread.filter((m) => m.isOwn).at(-1);

          return {
            id: contact.id,
            contact,
            lastMessage: thread.at(-1) ?? null,
            isSeen: settings.readReceipts && lastOwn?.readAt != null,
            unreadCount: thread.filter((m) => !m.isOwn && !m.readAt).length,
          };
        })
        .sort((a, b) =>
          (b.lastMessage?.sentAt ?? "").localeCompare(a.lastMessage?.sentAt ?? ""),
        ),
    [contacts, messages, settings.readReceipts],
  );

  const contactById = useCallback(
    (id: string) => contacts.find((c) => c.id === id) ?? null,
    [contacts],
  );

  const conversationById = useCallback(
    (id: string) => conversations.find((c) => c.id === id) ?? null,
    [conversations],
  );

  const messageById = useCallback(
    (id: string) => messages.find((m) => m.id === id) ?? null,
    [messages],
  );

  const statsOf = useCallback(
    (contactId: string): ContactStats => {
      const thread = messages.filter((m) => m.conversationId === contactId);
      const history = calls.filter((c) => c.contactId === contactId);

      return {
        messagesSent: thread.filter((m) => m.isOwn).length,
        messagesReceived: thread.filter((m) => !m.isOwn).length,
        callCount: history.length,
        callSeconds: history.reduce((total, c) => total + c.durationSeconds, 0),
      };
    },
    [messages, calls],
  );

  const addContact: AppDataValue["addContact"] = useCallback(
    (input) => {
      const publicKey = input.publicKey.trim().toLowerCase();

      const contact: Contact = {
        id: Crypto.randomUUID(),
        firstName: input.firstName.trim(),
        lastName: input.lastName?.trim() ?? "",
        publicKey,
        exchangePublicKey: input.exchangePublicKey.trim().toLowerCase(),
        fingerprint: formatFingerprint(publicKey),
        blockedAt: null,
        blockedByMeAt: null,
      };

      setContacts((current) => [...current, contact]);
      persist((key) => putContact(key, contact));
      return contact;
    },
    [persist],
  );

  const toggleBlockContact = useCallback(
    (id: string) => {
      const target = contacts.find((c) => c.id === id);
      if (!target) return;

      const updated: Contact = {
        ...target,
        blockedByMeAt: target.blockedByMeAt ? null : new Date().toISOString(),
      };

      setContacts((current) =>
        current.map((contact) => (contact.id === id ? updated : contact)),
      );
      persist((key) => putContact(key, updated));
    },
    [contacts, persist],
  );

  const removeContact = useCallback(
    (id: string) => {
      const thread = messages.filter((m) => m.conversationId === id);
      const messageIds = thread.map((m) => m.id);
      const mediaIds = thread.filter((m) => m.media).map((m) => m.id);
      const callIds = calls.filter((c) => c.contactId === id).map((c) => c.id);

      setContacts((current) => current.filter((c) => c.id !== id));
      setMessages((current) => current.filter((m) => m.conversationId !== id));
      setCalls((current) => current.filter((c) => c.contactId !== id));

      persist(async () => {
        await removeContacts([id]);
        await removeMessages(messageIds);
        await removeCalls(callIds);
        await deleteMedia(mediaIds);
      });
    },
    [messages, calls, persist],
  );

  const sendMessage = useCallback(
    (contactId: string, body: string) => {
      const target = contacts.find((c) => c.id === contactId);
      if (target && target.blockedByMeAt !== null) return;

      const message: Message = {
        id: Crypto.randomUUID(),
        conversationId: contactId,
        isOwn: true,
        body,
        sentAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, message]);
      persist((key) => putMessage(key, message));

      const contact = contacts.find((c) => c.id === contactId);
      const transport = transportRef.current;
      if (!contact || !transport) return;

      const payload: ChatPayload = {
        kind: "message",
        id: message.id,
        body: message.body,
        sentAt: message.sentAt,
      };
      const envelope = sealFor(
        contact.exchangePublicKey,
        JSON.stringify(payload),
      );
      if (envelope) transport.send(contact.publicKey, envelope);
    },
    [contacts, persist, sealFor],
  );

  const transferMedia = useCallback(
    async (message: Message, contact: Contact, bytes: Uint8Array) => {
      const transport = transportRef.current;
      if (!transport || !message.media || connection !== "connected") {
        setMediaStatus(message, "failed");
        return;
      }

      const push = (payload: WirePayload) => {
        const envelope = sealFor(
          contact.exchangePublicKey,
          JSON.stringify(payload),
        );
        if (!envelope) return false;
        transport.send(contact.publicKey, envelope);
        return true;
      };

      const encoded = bytesToBase64(bytes);
      const total = Math.max(1, Math.ceil(encoded.length / MEDIA_CHUNK_CHARS));

      const fail = () => {
        clearProgress(message.id);
        setMediaStatus(message, "failed");
      };

      const start: MediaStartPayload = {
        kind: "media-start",
        id: message.id,
        body: message.body,
        sentAt: message.sentAt,
        media: message.media,
        chunks: total,
      };
      if (!push(start)) return fail();

      reportProgress(message.id, 0);

      for (let index = 0; index < total; index += 1) {
        const chunk: MediaChunkPayload = {
          kind: "media-chunk",
          id: message.id,
          index,
          data: encoded.slice(
            index * MEDIA_CHUNK_CHARS,
            (index + 1) * MEDIA_CHUNK_CHARS,
          ),
        };
        if (!push(chunk)) return fail();
        reportProgress(message.id, (index + 1) / total);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      clearProgress(message.id);
      setMediaStatus(message, "ready");
    },
    [connection, sealFor, reportProgress, clearProgress, setMediaStatus],
  );

  const sendMedia = useCallback(
    async (contactId: string, picked: PickedMedia, body: string) => {
      const contact = contacts.find((c) => c.id === contactId);
      if (!contact || contact.blockedByMeAt !== null) return;

      const key = storageKey();
      if (!key) return;

      const bytes = await readSource(picked.uri);
      if (!bytes || bytes.length === 0 || bytes.length > MAX_MEDIA_BYTES) return;

      const message: Message = {
        id: Crypto.randomUUID(),
        conversationId: contactId,
        isOwn: true,
        body,
        sentAt: new Date().toISOString(),
        media: {
          kind: picked.kind,
          mime: picked.mime,
          bytes: bytes.length,
          width: picked.width,
          height: picked.height,
          durationMs: picked.durationMs,
        },
        mediaStatus: "transferring",
      };

      const stored = await storeMedia(key, message.id, bytes);

      setMessages((current) => [...current, message]);
      persist((k) => putMessage(k, message));

      if (!stored) {
        setMediaStatus(message, "failed");
        return;
      }

      await transferMedia(message, contact, bytes);
    },
    [contacts, storageKey, persist, setMediaStatus, transferMedia],
  );

  const retryMedia = useCallback(
    async (messageId: string) => {
      const message = messagesRef.current.find((m) => m.id === messageId);
      if (!message?.media || !message.isOwn) return;

      const contact = contacts.find((c) => c.id === message.conversationId);
      if (!contact || contact.blockedByMeAt !== null) return;

      const key = storageKey();
      if (!key) return;

      const bytes = await readMedia(key, messageId);
      if (!bytes) return;

      setMediaStatus(message, "transferring");
      await transferMedia(message, contact, bytes);
    },
    [contacts, storageKey, setMediaStatus, transferMedia],
  );

  const markConversationRead = useCallback(
    (contactId: string) => {
      const unread = messages.filter(
        (m) => m.conversationId === contactId && !m.isOwn && !m.readAt,
      );
      if (unread.length === 0) return;

      const readAt = new Date().toISOString();
      const ids = new Set(unread.map((m) => m.id));

      setMessages((current) =>
        current.map((m) => (ids.has(m.id) ? { ...m, readAt } : m)),
      );
      persist(async (key) => {
        for (const m of unread) await putMessage(key, { ...m, readAt });
      });

      if (!settings.readReceipts) return;
      const contact = contacts.find((c) => c.id === contactId);
      const transport = transportRef.current;
      if (!contact || !transport || contact.blockedByMeAt !== null) return;

      const payload: ReceiptPayload = {
        kind: "receipt",
        ids: [...ids],
        readAt,
      };
      const envelope = sealFor(
        contact.exchangePublicKey,
        JSON.stringify(payload),
      );
      if (envelope) transport.send(contact.publicKey, envelope);
    },
    [messages, contacts, persist, sealFor, settings.readReceipts],
  );

  const sendSignal = useCallback(
    (contactId: string, signal: CallSignal) => {
      const contact = contacts.find((c) => c.id === contactId);
      const transport = transportRef.current;
      if (!contact || !transport) return;

      const payload: SignalPayload = { kind: "signal", signal };
      const envelope = sealFor(
        contact.exchangePublicKey,
        JSON.stringify(payload),
      );
      if (envelope) transport.send(contact.publicKey, envelope);
    },
    [contacts, sealFor],
  );

  const onSignal = useCallback(
    (handler: (from: Contact, signal: CallSignal) => void) => {
      signalHandlers.current.add(handler);
      return () => signalHandlers.current.delete(handler);
    },
    [],
  );

  const logCall = useCallback(
    (contactId: string, durationSeconds: number, video: boolean): Call => {
      const call: Call = {
        id: Crypto.randomUUID(),
        contactId,
        direction: "outgoing",
        startedAt: new Date().toISOString(),
        durationSeconds,
        video,
      };

      setCalls((current) => [call, ...current]);
      persist((key) => putCall(key, call));
      return call;
    },
    [persist],
  );

  const exportBackup = useCallback(async (): Promise<BackupOutcome> => {
    const key = backupKey();
    if (!key) return { status: "locked" };

    const shared = await writeBackupFile(key, { contacts, messages, calls });
    return shared ? { status: "done" } : { status: "unavailable" };
  }, [backupKey, contacts, messages, calls]);

  const importBackup = useCallback(async (): Promise<BackupOutcome> => {
    const key = backupKey();
    if (!key) return { status: "locked" };

    const result = await pickBackup(key);
    if (result === "unavailable") return { status: "unavailable" };
    if (!result) return { status: "cancelled" };
    if (!result.ok) return { status: "failed", error: result.error };

    const nextContacts = mergeBackup(contacts, result.data.contacts);
    const nextMessages = mergeBackup(messages, result.data.messages);
    const nextCalls = mergeBackup(calls, result.data.calls);

    setContacts(nextContacts.merged);
    setMessages(nextMessages.merged);
    setCalls(nextCalls.merged);

    persist(async (storeKey) => {
      for (const contact of nextContacts.added) await putContact(storeKey, contact);
      for (const message of nextMessages.added) await putMessage(storeKey, message);
      for (const call of nextCalls.added) await putCall(storeKey, call);
    });

    return {
      status: "done",
      imported:
        nextContacts.added.length +
        nextMessages.added.length +
        nextCalls.added.length,
    };
  }, [backupKey, contacts, messages, calls, persist]);

  const value = useMemo(
    () => ({
      contacts,
      conversations,
      calls,
      connection,
      mediaProgress,
      contactById,
      conversationById,
      messageById,
      messagesOf,
      statsOf,
      addContact,
      toggleBlockContact,
      removeContact,
      sendMessage,
      sendMedia,
      retryMedia,
      markConversationRead,
      settings,
      updateSettings,
      exportBackup,
      importBackup,
      logCall,
      sendSignal,
      onSignal,
    }),
    [
      contacts,
      conversations,
      calls,
      connection,
      mediaProgress,
      contactById,
      conversationById,
      messageById,
      messagesOf,
      statsOf,
      addContact,
      toggleBlockContact,
      removeContact,
      sendMessage,
      sendMedia,
      retryMedia,
      markConversationRead,
      settings,
      updateSettings,
      exportBackup,
      importBackup,
      logCall,
      sendSignal,
      onSignal,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData doit être utilisé dans un <AppDataProvider>.");
  }
  return context;
};

export const displayName = (contact: Contact) =>
  [contact.firstName, contact.lastName].filter(Boolean).join(" ");
