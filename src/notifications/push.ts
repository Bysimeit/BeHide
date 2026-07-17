import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let cached: typeof import("expo-notifications") | null = null;
const getNotifications = async () => {
  if (isExpoGo) return null;
  if (!cached) cached = await import("expo-notifications");
  return cached;
};

export type NotificationTap = { from: string; kind: "message" | "call" };

const readTap = (data: unknown): NotificationTap | null => {
  if (!data || typeof data !== "object" || !("from" in data)) return null;
  const from = (data as { from?: unknown }).from;
  if (typeof from !== "string") return null;
  const rawKind = (data as { kind?: unknown }).kind;
  const kind = rawKind === "call" ? "call" : "message";
  return { from, kind };
};

export const registerForPushToken = async (): Promise<string | null> => {
  const Notifications = await getNotifications();
  if (!Notifications) {
    console.warn(
      "Notifications push indisponibles dans Expo Go : utilisez un development build.",
    );
    return null;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Messages",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted;
  if (!granted && current.canAskAgain) {
    granted = (await Notifications.requestPermissionsAsync()).granted;
  }
  if (!granted) return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    console.warn(
      "Notifications push désactivées : aucun projectId EAS. Voir server/README.md et lancez `eas init`.",
    );
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch (error) {
    console.warn("Obtention du token push échouée :", error);
    return null;
  }
};

export const presentMessageNotification = async (
  from: string,
  title: string,
  body: string,
): Promise<void> => {
  await present(title, body, { from, kind: "message" });
};

export const presentCallNotification = async (
  from: string,
  title: string,
  body: string,
): Promise<void> => {
  await present(title, body, { from, kind: "call" });
};

const present = async (
  title: string,
  body: string,
  data: { from: string; kind: "message" | "call" },
): Promise<void> => {
  const Notifications = await getNotifications();
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: "default", data },
      trigger: null,
    });
  } catch (error) {
    console.warn("Affichage de la notification échoué :", error);
  }
};

export const addNotificationResponseListener = (
  handler: (tap: NotificationTap) => void,
): (() => void) => {
  let subscription: { remove: () => void } | undefined;
  let cancelled = false;

  void getNotifications().then((Notifications) => {
    if (!Notifications || cancelled) return;
    subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const tap = readTap(response.notification.request.content.data);
        if (tap) handler(tap);
      },
    );
  });

  return () => {
    cancelled = true;
    subscription?.remove();
  };
};

export const getInitialNotificationTap =
  async (): Promise<NotificationTap | null> => {
    const Notifications = await getNotifications();
    if (!Notifications) return null;
    const response = await Notifications.getLastNotificationResponseAsync();
    if (!response) return null;
    return readTap(response.notification.request.content.data);
  };
