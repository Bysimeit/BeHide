import { StyleSheet, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors, spacing } from "../../constants/theme";
import { AppText } from "../ui/AppText";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => (
  <View style={styles.container}>
    <View style={styles.logo}>
      <Entypo name="chat" size={40} color={colors.textOnPrimary} />
    </View>
    <AppText weight="bold" style={styles.title}>
      {title}
    </AppText>
    <AppText muted style={styles.subtitle}>
      {subtitle}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: spacing(8),
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: spacing(4),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    alignSelf: "stretch",
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing(1),
    fontSize: 13,
    lineHeight: 19,
    alignSelf: "stretch",
    textAlign: "center",
  },
});
