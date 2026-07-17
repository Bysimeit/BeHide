export const colors = {
  background: "#E2FDFF",
  surface: "#FFFFFF",
  primary: "#00ABB6",
  primaryDark: "#00858D",
  accent: "#68D1FE",
  bubbleIncoming: "#55C8CF",
  bubbleOutgoing: "#C7EEF1",
  composer: "#55C8CF",
  composerField: "#C7EEF1",
  danger: "#E5484D",
  text: "#0B2226",
  textMuted: "#5C7378",
  textOnPrimary: "#FFFFFF",
  overlay: "rgba(11, 34, 38, 0.08)",
} as const;

export const radius = {
  sm: 12,
  md: 20,
  lg: 30,
  pill: 999,
} as const;

export const spacing = (steps: number) => steps * 4;

export const fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export type FontWeightName = keyof typeof fonts;

export const fontAssets = {
  "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
};

export const TAB_BAR_HEIGHT = 96;
