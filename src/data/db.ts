import * as SQLite from "expo-sqlite";
import type { Call, Contact, Message } from "../types";
import { open, seal, type Envelope } from "../p2p/envelope";

type Table = "contacts" | "messages" | "calls";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDb = (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("behide.db").then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS contacts (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS calls    (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL);
      `);
      return db;
    });
  }
  return dbPromise;
};

const encodeRow = (key: Uint8Array, value: unknown): string =>
  JSON.stringify(seal(key, JSON.stringify(value)));

const decodeRow = <T>(key: Uint8Array, data: string): T | null => {
  try {
    const plaintext = open(key, JSON.parse(data) as Envelope);
    return plaintext ? (JSON.parse(plaintext) as T) : null;
  } catch {
    return null;
  }
};

const readTable = async <T>(key: Uint8Array, table: Table): Promise<T[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<{ data: string }>(
    `SELECT data FROM ${table}`,
  );
  return rows
    .map((row) => decodeRow<T>(key, row.data))
    .filter((value): value is T => value !== null);
};

export const loadAll = async (
  key: Uint8Array,
): Promise<{ contacts: Contact[]; messages: Message[]; calls: Call[] }> => {
  const [contacts, messages, calls] = await Promise.all([
    readTable<Contact>(key, "contacts"),
    readTable<Message>(key, "messages"),
    readTable<Call>(key, "calls"),
  ]);
  return { contacts, messages, calls };
};

const put = async (
  key: Uint8Array,
  table: Table,
  id: string,
  value: unknown,
): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO ${table} (id, data) VALUES (?, ?)`,
    id,
    encodeRow(key, value),
  );
};

export const putContact = (key: Uint8Array, contact: Contact) =>
  put(key, "contacts", contact.id, contact);

export const putMessage = (key: Uint8Array, message: Message) =>
  put(key, "messages", message.id, message);

export const putCall = (key: Uint8Array, call: Call) =>
  put(key, "calls", call.id, call);

const removeRows = async (table: Table, ids: string[]): Promise<void> => {
  if (ids.length === 0) return;
  const db = await getDb();
  const placeholders = ids.map(() => "?").join(", ");
  await db.runAsync(`DELETE FROM ${table} WHERE id IN (${placeholders})`, ...ids);
};

export const removeContacts = (ids: string[]) => removeRows("contacts", ids);
export const removeMessages = (ids: string[]) => removeRows("messages", ids);
export const removeCalls = (ids: string[]) => removeRows("calls", ids);

export const clearDatabase = async (): Promise<void> => {
  const db = await getDb();
  await db.execAsync(
    "DELETE FROM contacts; DELETE FROM messages; DELETE FROM calls;",
  );
};
