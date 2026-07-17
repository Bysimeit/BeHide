import { storage } from "./keyValue";

const KEY = "behide.settings.v1";

export type Settings = {
  readReceipts: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  readReceipts: true,
};

export const readSettings = async (): Promise<Settings> => {
  try {
    const raw = await storage.get(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const writeSettings = async (settings: Settings): Promise<void> => {
  await storage.set(KEY, JSON.stringify(settings));
};
