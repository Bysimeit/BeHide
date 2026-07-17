import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { PublicKeyQrModal } from "../../components/ui/PublicKeyQrModal";
import { LanguageButton } from "../../components/ui/LanguageSelector";
import { colors, radius, spacing, TAB_BAR_HEIGHT } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { useAuth } from "../../auth/AuthContext";
import { useAppData, type BackupOutcome } from "../../data/store";

const ProfileScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const {
    identity,
    signOut,
    forgetIdentity,
    biometricAvailable,
    biometricEnabled,
    setBiometricEnabled,
  } = useAuth();
  const { settings, updateSettings, exportBackup, importBackup } = useAppData();
  const [bioToggling, setBioToggling] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  const reportBackup = (outcome: BackupOutcome, exporting: boolean) => {
    if (outcome.status === "cancelled") return;

    if (outcome.status === "done") {
      Alert.alert(
        exporting ? t("profile.exportedTitle") : t("profile.importedTitle"),
        exporting
          ? t("profile.exportedMessage")
          : outcome.imported === 0
            ? t("profile.importedNothing")
            : t("profile.importedMessage", { count: outcome.imported ?? 0 }),
      );
      return;
    }

    const message =
      outcome.status === "locked"
        ? t("profile.backupLocked")
        : outcome.status === "unavailable"
          ? t("profile.backupUnavailable")
          : outcome.error === "identity"
            ? t("profile.backupWrongIdentity")
            : outcome.error === "version"
              ? t("profile.backupWrongVersion")
              : t("profile.backupUnreadable");

    Alert.alert(
      exporting ? t("profile.exportFailedTitle") : t("profile.importFailedTitle"),
      message,
    );
  };

  const runBackup = async (exporting: boolean) => {
    setBusy(true);
    try {
      reportBackup(await (exporting ? exportBackup() : importBackup()), exporting);
    } catch (error) {
      console.warn("Sauvegarde échouée :", error);
      Alert.alert(t("profile.backupErrorTitle"), t("profile.backupErrorMessage"));
    } finally {
      setBusy(false);
    }
  };

  const confirmImport = () => {
    Alert.alert(
      t("profile.importConfirmTitle"),
      t("profile.importConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profile.importConfirmAction"),
          onPress: () => void runBackup(false),
        },
      ],
    );
  };

  const onToggleBiometric = async (next: boolean) => {
    setBioToggling(true);
    const applied = await setBiometricEnabled(next);
    setBioToggling(false);
    if (next && !applied) {
      Alert.alert(
        t("profile.biometricCancelledTitle"),
        t("profile.biometricCancelledMessage"),
      );
    }
  };

  const confirmExportKey = () => {
    Alert.alert(t("profile.recoverKeyTitle"), t("profile.recoverKeyMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.show"),
        style: "destructive",
        onPress: () => router.push("/private-key"),
      },
    ]);
  };

  const confirmForget = () => {
    Alert.alert(t("profile.forgetTitle"), t("profile.forgetMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.erase"),
        style: "destructive",
        onPress: () => void forgetIdentity(),
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <LanguageButton />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <Avatar size={96} firstName={identity?.pseudo ?? "?"} />
          <AppText weight="bold" style={styles.name}>
            {identity?.pseudo}
          </AppText>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="key" size={18} color={colors.primary} />
            <AppText weight="semiBold" style={styles.cardTitle}>
              {t("profile.publicKeyTitle")}
            </AppText>
          </View>
          <AppText muted style={styles.cardBody}>
            {t("profile.publicKeyBody")}
          </AppText>

          <View style={styles.keyBlock}>
            <View style={styles.keyBlockText}>
              <AppText muted style={styles.keyBlockLabel}>
                {t("profile.fingerprint")}
              </AppText>
              <AppText weight="semiBold" style={styles.keyBlockValue}>
                {identity?.fingerprint}
              </AppText>
            </View>
          </View>

          <Pressable
            onPress={() => setQrVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t("profile.shareQrLabel")}
            style={({ pressed }) => [
              styles.shareButton,
              pressed && styles.shareButtonPressed,
            ]}
          >
            <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
            <AppText weight="semiBold" style={styles.shareLabel}>
              {t("profile.shareQr")}
            </AppText>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <AppText weight="semiBold">{t("profile.biometric")}</AppText>
              <AppText muted style={styles.settingHint}>
                {biometricAvailable
                  ? t("profile.biometricHint")
                  : t("profile.biometricUnavailable")}
              </AppText>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={onToggleBiometric}
              disabled={!biometricAvailable || bioToggling}
              trackColor={{ false: colors.overlay, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View>
            <AppText weight="semiBold">{t("profile.backups")}</AppText>
            <AppText muted style={styles.settingHint}>
              {t("profile.backupsHint")}
            </AppText>
          </View>

          <View style={styles.backupActions}>
            <Pressable
              onPress={() => void runBackup(true)}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={t("profile.exportLabel")}
              style={({ pressed }) => [
                styles.backupButton,
                pressed && styles.shareButtonPressed,
                busy && styles.backupButtonDisabled,
              ]}
            >
              <Feather name="upload" size={16} color={colors.primary} />
              <AppText weight="semiBold" style={styles.backupLabel}>
                {t("profile.export")}
              </AppText>
            </Pressable>

            <Pressable
              onPress={confirmImport}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={t("profile.importLabel")}
              style={({ pressed }) => [
                styles.backupButton,
                pressed && styles.shareButtonPressed,
                busy && styles.backupButtonDisabled,
              ]}
            >
              <Feather name="download" size={16} color={colors.primary} />
              <AppText weight="semiBold" style={styles.backupLabel}>
                {t("profile.import")}
              </AppText>
            </Pressable>
          </View>

          <AppText muted style={styles.backupNote}>
            {t("profile.backupNote")}
          </AppText>

          <View style={styles.separator} />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <AppText weight="semiBold">{t("profile.readReceipts")}</AppText>
              <AppText muted style={styles.settingHint}>
                {t("profile.readReceiptsHint")}
              </AppText>
            </View>
            <Switch
              value={settings.readReceipts}
              onValueChange={(readReceipts) => updateSettings({ readReceipts })}
              trackColor={{ false: colors.overlay, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        <Button
          label={t("profile.lockSession")}
          variant="secondary"
          onPress={signOut}
          style={styles.action}
        />

        <View style={styles.dangerZone}>
          <View style={styles.dangerHeader}>
            <Feather name="alert-triangle" size={16} color={colors.danger} />
            <AppText weight="semiBold" style={styles.dangerTitle}>
              {t("profile.dangerZone")}
            </AppText>
          </View>

          <View style={styles.dangerRow}>
            <View style={styles.dangerText}>
              <AppText weight="semiBold">{t("profile.recoverKey")}</AppText>
              <AppText muted style={styles.dangerHint}>
                {t("profile.recoverKeyHint")}
              </AppText>
            </View>
            <Pressable
              onPress={confirmExportKey}
              accessibilityRole="button"
              accessibilityLabel={t("profile.recoverKey")}
              style={({ pressed }) => [
                styles.dangerAction,
                pressed && styles.dangerActionPressed,
              ]}
            >
              <AppText weight="semiBold" style={styles.dangerActionLabel}>
                {t("common.show")}
              </AppText>
            </Pressable>
          </View>

          <View style={styles.dangerDivider} />

          <View style={styles.dangerRow}>
            <View style={styles.dangerText}>
              <AppText weight="semiBold">{t("profile.forget")}</AppText>
              <AppText muted style={styles.dangerHint}>
                {t("profile.forgetHint")}
              </AppText>
            </View>
            <Pressable
              onPress={confirmForget}
              accessibilityRole="button"
              accessibilityLabel={t("profile.forget")}
              style={({ pressed }) => [
                styles.dangerAction,
                styles.dangerActionSolid,
                pressed && styles.dangerActionPressed,
              ]}
            >
              <AppText weight="semiBold" style={styles.dangerActionSolidLabel}>
                {t("common.erase")}
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <PublicKeyQrModal
        visible={qrVisible}
        publicKey={identity?.publicKey ?? ""}
        exchangePublicKey={identity?.exchangePublicKey ?? ""}
        onClose={() => setQrVisible(false)}
      />
    </Screen>
  );
};

const DANGER_BORDER = "rgba(229, 72, 77, 0.35)";
const DANGER_TINT = "rgba(229, 72, 77, 0.06)";

const styles = StyleSheet.create({
  topBar: {
    marginTop: spacing(2),
    paddingHorizontal: spacing(5),
    alignItems: "flex-start",
  },
  content: {
    paddingTop: spacing(4),
    paddingHorizontal: spacing(5),
    paddingBottom: TAB_BAR_HEIGHT + spacing(4),
  },
  identity: {
    alignItems: "center",
  },
  name: {
    marginTop: spacing(3),
    fontSize: 24,
  },
  card: {
    marginTop: spacing(5),
    padding: spacing(4),
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    marginLeft: spacing(2),
    fontSize: 16,
  },
  cardBody: {
    marginTop: spacing(2),
    fontSize: 13,
    lineHeight: 19,
  },
  keyBlock: {
    marginTop: spacing(4),
    padding: spacing(3.5),
    borderRadius: radius.md,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
  },
  keyBlockText: {
    flex: 1,
  },
  keyBlockLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  keyBlockValue: {
    marginTop: spacing(1),
    fontSize: 15,
    fontVariant: ["tabular-nums"],
  },
  shareButton: {
    marginTop: spacing(3),
    paddingVertical: spacing(3),
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonPressed: {
    opacity: 0.7,
  },
  shareLabel: {
    marginLeft: spacing(2),
    fontSize: 14,
    color: colors.primary,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    flex: 1,
    marginRight: spacing(3),
  },
  settingHint: {
    marginTop: spacing(0.5),
    fontSize: 12,
  },
  separator: {
    marginVertical: spacing(3),
    height: 1,
    backgroundColor: colors.overlay,
  },
  backupActions: {
    marginTop: spacing(3),
    flexDirection: "row",
    gap: spacing(2),
  },
  backupButton: {
    flex: 1,
    paddingVertical: spacing(2.5),
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backupButtonDisabled: {
    opacity: 0.4,
  },
  backupLabel: {
    marginLeft: spacing(1.5),
    fontSize: 13,
    color: colors.primary,
  },
  backupNote: {
    marginTop: spacing(2),
    fontSize: 11,
    lineHeight: 16,
  },
  action: {
    marginTop: spacing(3),
  },
  dangerZone: {
    marginTop: spacing(6),
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: DANGER_BORDER,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3),
    backgroundColor: DANGER_TINT,
    borderBottomWidth: 1,
    borderBottomColor: DANGER_BORDER,
  },
  dangerTitle: {
    marginLeft: spacing(2),
    fontSize: 15,
    color: colors.danger,
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing(4),
  },
  dangerText: {
    flex: 1,
    marginRight: spacing(3),
  },
  dangerHint: {
    marginTop: spacing(0.5),
    fontSize: 12,
    lineHeight: 16,
  },
  dangerDivider: {
    height: 1,
    marginHorizontal: spacing(4),
    backgroundColor: DANGER_BORDER,
  },
  dangerAction: {
    paddingHorizontal: spacing(4),
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerActionSolid: {
    backgroundColor: colors.danger,
  },
  dangerActionPressed: {
    opacity: 0.65,
  },
  dangerActionLabel: {
    fontSize: 13,
    color: colors.danger,
  },
  dangerActionSolidLabel: {
    fontSize: 13,
    color: colors.textOnPrimary,
  },
  version: {
    marginTop: spacing(6),
    fontSize: 12,
    textAlign: "center",
  },
});

export default ProfileScreen;
