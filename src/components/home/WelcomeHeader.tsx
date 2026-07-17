import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../../constants/theme";
import { useDateFormat } from "../../i18n";
import { AppText } from "../ui/AppText";
import { Avatar } from "../ui/Avatar";

type WelcomeHeaderProps = {
  firstName: string;
};

export const WelcomeHeader = ({ firstName }: WelcomeHeaderProps) => {
  const { greeting } = useDateFormat();

  return (
    <View style={styles.container}>
      <View style={styles.avatarFrame}>
        <Avatar size={78} firstName={firstName} />
      </View>

      <View style={styles.bubble}>
        <AppText weight="medium" style={styles.text} numberOfLines={1}>
          {greeting(firstName)}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing(2),
    marginLeft: spacing(5),
    flexDirection: "row",
    alignItems: "center",
  },
  avatarFrame: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: spacing(5),
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    flexShrink: 1,
    height: 60,
    paddingHorizontal: spacing(5),
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
  },
});
