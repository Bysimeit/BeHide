import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const storage = {
  get: (key: string): Promise<string | null> | string | null =>
    Platform.OS === "web"
      ? globalThis.localStorage?.getItem(key) ?? null
      : SecureStore.getItemAsync(key),

  set: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
};
