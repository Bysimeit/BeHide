import Constants, { ExecutionEnvironment } from "expo-constants";
import { open, seal, type Envelope } from "../p2p/envelope";
import type { Call, Contact, Message } from "../types";

export const isBackupSupported =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

type FileSystem = typeof import("expo-file-system");
type SharingModule = typeof import("expo-sharing");

let fileSystem: FileSystem | null = null;
let sharing: SharingModule | null = null;

const loadNativeModules = async (): Promise<{
  fs: FileSystem;
  share: SharingModule;
} | null> => {
  if (!isBackupSupported) return null;
  try {
    const fs = fileSystem ?? (await import("expo-file-system"));
    const share = sharing ?? (await import("expo-sharing"));

    if (typeof share.shareAsync !== "function" || typeof fs.File !== "function") {
      console.warn(
        "Modules de sauvegarde absents de ce build : reconstruisez l'application (npx expo prebuild).",
      );
      return null;
    }

    fileSystem = fs;
    sharing = share;
    return { fs, share };
  } catch (error) {
    console.warn("Modules de sauvegarde indisponibles :", error);
    return null;
  }
};

type BackupFile = {
  format: "behide-backup";
  version: 1;
  exportedAt: string;
  payload: Envelope;
};

export type BackupData = {
  contacts: Contact[];
  messages: Message[];
  calls: Call[];
};

export const BACKUP_VERSION = 1;

const fileName = (date: Date) =>
  `behide-${date.toISOString().slice(0, 10)}.behide`;

export const buildBackup = (key: Uint8Array, data: BackupData): string => {
  const file: BackupFile = {
    format: "behide-backup",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    payload: seal(key, JSON.stringify(data)),
  };
  return JSON.stringify(file);
};

export type BackupError =
  | "unreadable"
  | "version"
  | "identity";

export const readBackup = (
  key: Uint8Array,
  content: string,
): { ok: true; data: BackupData } | { ok: false; error: BackupError } => {
  let file: BackupFile;
  try {
    file = JSON.parse(content) as BackupFile;
  } catch {
    return { ok: false, error: "unreadable" };
  }

  if (file?.format !== "behide-backup" || !file.payload) {
    return { ok: false, error: "unreadable" };
  }
  if (typeof file.version !== "number" || file.version > BACKUP_VERSION) {
    return { ok: false, error: "version" };
  }

  const plaintext = open(key, file.payload);
  if (!plaintext) return { ok: false, error: "identity" };

  try {
    const data = JSON.parse(plaintext) as BackupData;
    if (!Array.isArray(data.contacts)) {
      return { ok: false, error: "unreadable" };
    }
    return {
      ok: true,
      data: {
        contacts: data.contacts,
        messages: Array.isArray(data.messages) ? data.messages : [],
        calls: Array.isArray(data.calls) ? data.calls : [],
      },
    };
  } catch {
    return { ok: false, error: "unreadable" };
  }
};

export const exportBackup = async (
  key: Uint8Array,
  data: BackupData,
): Promise<boolean> => {
  const native = await loadNativeModules();
  if (!native) return false;
  if (!(await native.share.isAvailableAsync())) return false;

  const file = new native.fs.File(native.fs.Paths.cache, fileName(new Date()));
  if (file.exists) file.delete();
  file.create();
  file.write(buildBackup(key, data));

  await native.share.shareAsync(file.uri, {
    mimeType: "application/json",
    dialogTitle: "Exporter la sauvegarde BeHide",
    UTI: "public.json",
  });
  return true;
};

export const pickBackup = async (
  key: Uint8Array,
): Promise<
  | { ok: true; data: BackupData }
  | { ok: false; error: BackupError }
  | "unavailable"
  | null
> => {
  const native = await loadNativeModules();
  if (!native) return "unavailable";

  const picked = await native.fs.File.pickFileAsync({ mimeTypes: ["*/*"] });
  if (picked.canceled) return null;

  try {
    return readBackup(key, await picked.result.text());
  } catch {
    return { ok: false, error: "unreadable" };
  }
};

export const mergeBackup = <T extends { id: string }>(
  current: T[],
  incoming: T[],
): { merged: T[]; added: T[] } => {
  const known = new Set(current.map((item) => item.id));
  const added = incoming.filter((item) => !known.has(item.id));
  return { merged: [...current, ...added], added };
};
