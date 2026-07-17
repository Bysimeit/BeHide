export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  publicKey: string;
  exchangePublicKey: string;
  fingerprint: string;
  blockedAt: string | null;
  blockedByMeAt: string | null;
};

export type Message = {
  id: string;
  conversationId: string;
  isOwn: boolean;
  body: string;
  sentAt: string;
  readAt?: string;
};

export type Conversation = {
  id: string;
  contact: Contact;
  lastMessage: Message | null;
  isSeen: boolean;
  unreadCount: number;
};

export type CallDirection = "incoming" | "outgoing" | "missed";

export type Call = {
  id: string;
  contactId: string;
  direction: CallDirection;
  startedAt: string;
  durationSeconds: number;
  video?: boolean;
};

export type ContactStats = {
  messagesSent: number;
  messagesReceived: number;
  callCount: number;
  callSeconds: number;
};
