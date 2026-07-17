import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { AppText } from "./AppText";

type ScreenHeaderProps = {
  title: string;
  onBack: () => void;
};

export const ScreenHeader = ({ title, onBack }: ScreenHeaderProps) => {
  const t = useTranslate();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={t("common.back")}
        hitSlop={12}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-back" size={26} color={colors.text} />
      </Pressable>
      <AppText weight="bold" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing(6),
    marginBottom: spacing(2),
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    marginRight: spacing(1),
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    flex: 1,
    fontSize: 22,
  },
});
