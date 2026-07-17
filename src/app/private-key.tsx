import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "../components/ui/Screen";
import { AppText } from "../components/ui/AppText";
import { Button } from "../components/ui/Button";
import { ScreenHeader } from "../components/ui/ScreenHeader";
import { colors, radius, spacing } from "../constants/theme";
import { useTranslate } from "../i18n";
import { useAuth } from "../auth/AuthContext";

const PrivateKeyScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { exportPrivateKey } = useAuth();
  const privateKey = exportPrivateKey();

  return (
    <Screen style={styles.screen}>
      <ScreenHeader title={t("privateKey.title")} onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Feather name="alert-triangle" size={18} color={colors.danger} />
          <AppText style={styles.bannerText}>{t("privateKey.banner")}</AppText>
        </View>

        {privateKey ? (
          <>
            <AppText muted style={styles.label}>
              {t("privateKey.label")}
            </AppText>
            <View style={styles.keyBox}>
              <AppText selectable style={styles.key}>
                {privateKey}
              </AppText>
            </View>
            <AppText muted style={styles.hint}>
              {t("privateKey.hint")}
            </AppText>
          </>
        ) : (
          <AppText muted style={styles.locked}>
            {t("privateKey.locked")}
          </AppText>
        )}

        <Button
          label={t("privateKey.done")}
          onPress={() => router.back()}
          style={styles.done}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing(5),
  },
  content: {
    paddingBottom: spacing(8),
  },
  banner: {
    marginTop: spacing(2),
    padding: spacing(3.5),
    borderRadius: radius.md,
    backgroundColor: "rgba(229, 72, 77, 0.08)",
    flexDirection: "row",
  },
  bannerText: {
    flex: 1,
    marginLeft: spacing(2),
    fontSize: 13,
    lineHeight: 18,
    color: colors.danger,
  },
  label: {
    marginTop: spacing(5),
    marginBottom: spacing(1.5),
    fontSize: 12,
  },
  keyBox: {
    padding: spacing(4),
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  key: {
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 1,
    fontFamily: Platform.select({ ios: "Courier", default: "monospace" }),
  },
  hint: {
    marginTop: spacing(3),
    fontSize: 12,
    lineHeight: 17,
  },
  locked: {
    marginTop: spacing(6),
    textAlign: "center",
  },
  done: {
    marginTop: spacing(6),
  },
});

export default PrivateKeyScreen;
