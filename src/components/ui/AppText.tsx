import { StyleSheet, Text, type TextProps } from "react-native";
import { colors, fonts, type FontWeightName } from "../../constants/theme";

type AppTextProps = TextProps & {
  weight?: FontWeightName;
  muted?: boolean;
};

export const AppText = ({
  weight = "regular",
  muted = false,
  style,
  ...props
}: AppTextProps) => (
  <Text
    style={[
      styles.base,
      { fontFamily: fonts[weight] },
      muted && styles.muted,
      style,
    ]}
    {...props}
  />
);

const styles = StyleSheet.create({
  base: {
    color: colors.text,
    fontSize: 15,
  },
  muted: {
    color: colors.textMuted,
  },
});
