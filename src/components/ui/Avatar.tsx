import { StyleSheet, View } from "react-native";
import { colors, fonts } from "../../constants/theme";
import { AppText } from "./AppText";

type AvatarProps = {
  size: number;
  firstName: string;
  lastName?: string;
  backgroundColor?: string;
};

const PALETTE = ["#00ABB6", "#68D1FE", "#3F8EFC", "#7B6CF6", "#F2789F", "#F4A259"];

const colorFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  return PALETTE[hash % PALETTE.length];
};

export const Avatar = ({
  size,
  firstName,
  lastName = "",
  backgroundColor,
}: AvatarProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor ?? colorFor(firstName + lastName),
        },
      ]}
    >
      <AppText style={[styles.initials, { fontSize: size * 0.38 }]}>
        {initials}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: colors.textOnPrimary,
    fontFamily: fonts.semiBold,
  },
});
