import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import type { EncryptedSecret, Identity } from "./identity";

const KEY = "behide.identity.v2";
const BIOMETRIC_KEY = "behide.biometric-secret.v2";

export type VaultRecord = {
  identity: Identity;
  secret: EncryptedSecret;
  biometricEnabled?: boolean;
};

const storage = {
  get: async (key: string) =>
    Platform.OS === "web"
      ? globalThis.localStorage?.getItem(key) ?? null
      : SecureStore.getItemAsync(key),

  set: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  remove: async (key: string) => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const readVault = async (): Promise<VaultRecord | null> => {
  const raw = await storage.get(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as VaultRecord;
  } catch {
    await storage.remove(KEY);
    return null;
  }
};

export const writeVault = async (record: VaultRecord) => {
  await storage.set(KEY, JSON.stringify(record));
};

export const clearVault = async () => {
  await storage.remove(KEY);
};

export const writeBiometricSecret = (privateKey: string) =>
  storage.set(BIOMETRIC_KEY, privateKey);

export const readBiometricSecret = () => storage.get(BIOMETRIC_KEY);

export const clearBiometricSecret = () => storage.remove(BIOMETRIC_KEY);
