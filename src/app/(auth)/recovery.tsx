import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { colors, radius, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { useAuth } from "../../auth/AuthContext";

const RecoveryScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { identity, exportPrivateKey } = useAuth();
  const [acknowledged, setAcknowledged] = useState(false);

  const privateKey = exportPrivateKey();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <AuthHeader title={t("recovery.title")} subtitle={t("recovery.subtitle")} />

        {privateKey ? (
          <>
            <AppText muted style={styles.label}>
              {t("recovery.label")}
            </AppText>
            <View style={styles.keyBox}>
              <AppText selectable style={styles.key}>
                {privateKey}
              </AppText>
            </View>
            <AppText muted style={styles.hint}>
              {t("recovery.hint")}
            </AppText>
          </>
        ) : (
          <AppText muted style={styles.locked}>
            {t("recovery.unavailable")}
          </AppText>
        )}

        {identity && (
          <View style={styles.fingerprint}>
            <AppText muted style={styles.fingerprintLabel}>
              {t("recovery.fingerprint")}
            </AppText>
            <AppText weight="semiBold">{identity.fingerprint}</AppText>
          </View>
        )}

        <View style={styles.notice}>
          <Feather name="eye-off" size={16} color={colors.primary} />
          <AppText muted style={styles.noticeText}>
            {t("recovery.notice")}
          </AppText>
        </View>

        <Button
          label={acknowledged ? t("common.continue") : t("recovery.acknowledge")}
          onPress={() =>
            acknowledged ? router.replace("/") : setAcknowledged(true)
          }
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing(6),
    paddingVertical: spacing(8),
  },
  label: {
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
    marginVertical: spacing(4),
    textAlign: "center",
  },
  fingerprint: {
    marginTop: spacing(4),
    alignItems: "center",
  },
  fingerprintLabel: {
    marginBottom: spacing(0.5),
    fontSize: 12,
  },
  notice: {
    marginVertical: spacing(5),
    flexDirection: "row",
  },
  noticeText: {
    flex: 1,
    marginLeft: spacing(2),
    fontSize: 12,
    lineHeight: 17,
  },
});

export default RecoveryScreen;
