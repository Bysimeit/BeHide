import { storage } from "../data/keyValue";
import { isLanguagePreference, type LanguagePreference } from "./languages";

const KEY = "behide.language.v1";

export const readLanguagePreference =
  async (): Promise<LanguagePreference> => {
    try {
      const raw = await storage.get(KEY);
      return isLanguagePreference(raw) ? raw : "system";
    } catch {
      return "system";
    }
  };

export const writeLanguagePreference = async (
  preference: LanguagePreference,
): Promise<void> => {
  await storage.set(KEY, preference);
};
