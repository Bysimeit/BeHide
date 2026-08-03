import { openBytes, sealBytes } from "../p2p/envelope";

type FileSystem = typeof import("expo-file-system");

const VAULT_DIR = "media";
const CACHE_DIR = "media";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/x-matroska": "mkv",
  "video/webm": "webm",
  "video/3gpp": "3gp",
};

let fileSystem: FileSystem | null = null;

const loadFileSystem = async (): Promise<FileSystem | null> => {
  if (fileSystem) return fileSystem;
  try {
    const fs = await import("expo-file-system");
    if (typeof fs.File !== "function") return null;
    fileSystem = fs;
    return fs;
  } catch (error) {
    console.warn("Modules de fichiers indisponibles :", error);
    return null;
  }
};

export const extensionFor = (mime: string) => EXTENSIONS[mime] ?? "bin";

const safeName = (id: string) => {
  const cleaned = id.replace(/[^A-Za-z0-9_-]/g, "");
  return cleaned.length > 0 && cleaned.length <= 128 ? cleaned : null;
};

const vaultDirectory = (fs: FileSystem) =>
  new fs.Directory(fs.Paths.document, VAULT_DIR);

const cacheDirectory = (fs: FileSystem) =>
  new fs.Directory(fs.Paths.cache, CACHE_DIR);

const vaultFile = (fs: FileSystem, id: string) => {
  const name = safeName(id);
  return name ? new fs.File(vaultDirectory(fs), name) : null;
};

export const sourceInfo = async (
  uri: string,
): Promise<{ bytes: number } | null> => {
  const fs = await loadFileSystem();
  if (!fs) return null;
  try {
    const file = new fs.File(uri);
    return file.exists ? { bytes: file.size } : null;
  } catch {
    return null;
  }
};

export const readSource = async (uri: string): Promise<Uint8Array | null> => {
  const fs = await loadFileSystem();
  if (!fs) return null;
  try {
    return await new fs.File(uri).bytes();
  } catch (error) {
    console.warn("Lecture du média source échouée :", error);
    return null;
  }
};

export const storeMedia = async (
  key: Uint8Array,
  id: string,
  plaintext: Uint8Array,
): Promise<boolean> => {
  const fs = await loadFileSystem();
  if (!fs) return false;
  try {
    const file = vaultFile(fs, id);
    if (!file) return false;

    const directory = vaultDirectory(fs);
    if (!directory.exists) directory.create({ intermediates: true });

    if (file.exists) file.delete();
    file.create();
    file.write(sealBytes(key, plaintext));
    return true;
  } catch (error) {
    console.warn("Écriture du média échouée :", error);
    return false;
  }
};

export const readMedia = async (
  key: Uint8Array,
  id: string,
): Promise<Uint8Array | null> => {
  const fs = await loadFileSystem();
  if (!fs) return null;
  try {
    const file = vaultFile(fs, id);
    if (!file?.exists) return null;
    return openBytes(key, await file.bytes());
  } catch (error) {
    console.warn("Lecture du média échouée :", error);
    return null;
  }
};

export const revealMedia = async (
  key: Uint8Array,
  id: string,
  mime: string,
): Promise<string | null> => {
  const fs = await loadFileSystem();
  if (!fs) return null;

  const base = safeName(id);
  if (!base) return null;

  try {
    const directory = cacheDirectory(fs);
    if (!directory.exists) directory.create({ intermediates: true });

    const target = new fs.File(directory, `${base}.${extensionFor(mime)}`);
    if (target.exists && target.size > 0) return target.uri;

    const plaintext = await readMedia(key, id);
    if (!plaintext) return null;

    if (target.exists) target.delete();
    target.create();
    target.write(plaintext);
    return target.uri;
  } catch (error) {
    console.warn("Ouverture du média échouée :", error);
    return null;
  }
};

export const deleteMedia = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) return;
  const fs = await loadFileSystem();
  if (!fs) return;

  for (const id of ids) {
    try {
      const file = vaultFile(fs, id);
      if (file?.exists) file.delete();
    } catch {
      continue;
    }
  }
};

export const clearMediaCache = async (): Promise<void> => {
  const fs = await loadFileSystem();
  if (!fs) return;
  try {
    const directory = cacheDirectory(fs);
    if (directory.exists) directory.delete();
  } catch (error) {
    console.warn("Purge du cache média échouée :", error);
  }
};

export const clearMediaVault = async (): Promise<void> => {
  const fs = await loadFileSystem();
  if (!fs) return;
  try {
    const directory = vaultDirectory(fs);
    if (directory.exists) directory.delete();
  } catch (error) {
    console.warn("Purge des médias échouée :", error);
  }
  await clearMediaCache();
};
