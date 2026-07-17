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
import { RELAY_URL } from "../constants/config";
import type {
  Call,
  Contact,
  ContactStats,
  Conversation,
  Message,
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
type SignalPayload = { kind: "signal"; signal: CallSignal };
type ReceiptPayload = { kind: "receipt"; ids: string[]; readAt: string };
type WirePayload = ChatPayload | SignalPayload | ReceiptPayload;

type AppDataValue = {
  contacts: Contact[];
  conversations: Conversation[];
  calls: Call[];
  connection: TransportState;
  contactById: (id: string) => Contact | null;
  conversationById: (id: string) => Conversation | null;
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
  const [loaded, setLoaded] = useState(false);

  const transportRef = useRef<Transport | null>(null);
  const signalHandlers = useRef(
    new Set<(from: Contact, signal: CallSignal) => void>(),
  );

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
      setLoaded(false);
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
      const messageIds = messages
        .filter((m) => m.conversationId === id)
        .map((m) => m.id);
      const callIds = calls.filter((c) => c.contactId === id).map((c) => c.id);

      setContacts((current) => current.filter((c) => c.id !== id));
      setMessages((current) => current.filter((m) => m.conversationId !== id));
      setCalls((current) => current.filter((c) => c.contactId !== id));

      persist(async () => {
        await removeContacts([id]);
        await removeMessages(messageIds);
        await removeCalls(callIds);
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
      contactById,
      conversationById,
      messagesOf,
      statsOf,
      addContact,
      toggleBlockContact,
      removeContact,
      sendMessage,
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
      contactById,
      conversationById,
      messagesOf,
      statsOf,
      addContact,
      toggleBlockContact,
      removeContact,
      sendMessage,
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
