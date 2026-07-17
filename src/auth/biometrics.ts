import { Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export type BiometricKind = "face" | "fingerprint" | "iris" | "generic";

export type BiometricSupport = {
  available: boolean;
  kind: BiometricKind;
};

export type BiometricOutcome = "success" | "cancelled" | "failed" | "unavailable";

const UNSUPPORTED: BiometricSupport = { available: false, kind: "generic" };

export const getBiometricSupport = async (): Promise<BiometricSupport> => {
  if (Platform.OS === "web") return UNSUPPORTED;

  const [hasHardware, enrolled, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  const { AuthenticationType } = LocalAuthentication;
  const kind: BiometricKind = types.includes(
    AuthenticationType.FACIAL_RECOGNITION,
  )
    ? "face"
    : types.includes(AuthenticationType.FINGERPRINT)
      ? "fingerprint"
      : types.includes(AuthenticationType.IRIS)
        ? "iris"
        : "generic";

  return { available: hasHardware && enrolled, kind };
};

export const biometricLabel = (kind: BiometricKind): string => {
  switch (kind) {
    case "face":
      return "reconnaissance faciale";
    case "fingerprint":
      return "empreinte";
    case "iris":
      return "iris";
    default:
      return "biométrie";
  }
};

export const runBiometricCheck = async (
  promptMessage: string,
  cancelLabel: string,
): Promise<BiometricOutcome> => {
  if (Platform.OS === "web") return "unavailable";

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel,
    disableDeviceFallback: true,
  });

  if (result.success) return "success";

  if (
    result.error === "user_cancel" ||
    result.error === "system_cancel" ||
    result.error === "app_cancel" ||
    result.error === "user_fallback"
  ) {
    return "cancelled";
  }

  return "failed";
};
