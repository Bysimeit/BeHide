import Constants, { ExecutionEnvironment } from "expo-constants";

export const isCallSupported =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

export const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export type WebRTC = typeof import("react-native-webrtc");

let cached: WebRTC | null = null;

export const loadWebRTC = async (): Promise<WebRTC | null> => {
  if (!isCallSupported) return null;
  if (cached) return cached;
  try {
    cached = await import("react-native-webrtc");
    return cached;
  } catch (error) {
    console.warn("react-native-webrtc indisponible :", error);
    return null;
  }
};
