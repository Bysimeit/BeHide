import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { LoadingOverlay } from "../../components/ui/LoadingOverlay";
import { LanguagePill } from "../../components/ui/LanguageSelector";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { colors, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { InvalidPassphraseError, useAuth } from "../../auth/AuthContext";

const MAX_BIOMETRIC_ATTEMPTS = 3;

const PRIMARY_TINT = "rgba(0, 171, 182, 0.10)";

type FeatureProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
};

const Feature = ({ icon, label }: FeatureProps) => (
  <View style={styles.feature}>
    <View style={styles.featureIcon}>
      <Feather name={icon} size={16} color={colors.primary} />
    </View>
    <AppText style={styles.featureLabel}>{label}</AppText>
  </View>
);

const LoginScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const {
    identity,
    unlock,
    biometricAvailable,
    biometricEnabled,
    unlockWithBiometrics,
  } = useAuth();

  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [bioBusy, setBioBusy] = useState(false);
  const [bioFailed, setBioFailed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const autoPrompted = useRef(false);

  const canUseBiometric = biometricEnabled && biometricAvailable;
  const bioExhausted = attempts >= MAX_BIOMETRIC_ATTEMPTS;
  const bioOffered = canUseBiometric && !bioExhausted;

  const bioNotice = !bioFailed
    ? null
    : bioExhausted
      ? t("login.biometricExhausted")
      : t("login.biometricFailed", {
          attempt: attempts,
          max: MAX_BIOMETRIC_ATTEMPTS,
        });

  const tryBiometric = async () => {
    setError(null);
    setBioFailed(false);
    setBioBusy(true);
    try {
      const outcome = await unlockWithBiometrics();
      if (outcome === "success") {
        router.replace("/");
        return;
      }
      if (outcome !== "failed") return;

      setAttempts((current) => current + 1);
      setBioFailed(true);
    } finally {
      setBioBusy(false);
    }
  };

  useEffect(() => {
    if (bioOffered && !autoPrompted.current) {
      autoPrompted.current = true;
      void tryBiometric();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bioOffered]);

  const submit = async () => {
    setError(null);
    setBusy(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 0));
    try {
      await unlock(passphrase);
      router.replace("/");
    } catch (cause) {
      setError(
        cause instanceof InvalidPassphraseError
          ? t("login.wrongPassphrase")
          : t("login.vaultError"),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <LoadingOverlay
        visible={busy}
        title={t("login.loadingTitle")}
        message={t("login.loadingMessage")}
      />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AuthHeader
            title={
              identity
                ? t("login.welcomeBack", { pseudo: identity.pseudo })
                : t("login.welcome")
            }
            subtitle={
              identity ? t("login.subtitleIdentity") : t("login.subtitleNew")
            }
          />

          {identity ? (
            <>
              {bioOffered && (
                <View style={styles.biometricBlock}>
                  <Button
                    label={t("login.biometricAction")}
                    variant="secondary"
                    onPress={tryBiometric}
                    loading={bioBusy}
                  />
                  {bioNotice && (
                    <View style={styles.notice}>
                      <Feather
                        name="alert-circle"
                        size={14}
                        color={colors.danger}
                      />
                      <AppText style={styles.noticeText}>{bioNotice}</AppText>
                    </View>
                  )}
                  <View style={styles.divider}>
                    <View style={styles.line} />
                    <AppText muted style={styles.dividerText}>
                      {t("login.orPassphrase")}
                    </AppText>
                    <View style={styles.line} />
                  </View>
                </View>
              )}

              {bioExhausted && bioNotice && (
                <View style={styles.notice}>
                  <Feather
                    name="alert-circle"
                    size={14}
                    color={colors.danger}
                  />
                  <AppText style={styles.noticeText}>{bioNotice}</AppText>
                </View>
              )}

              <TextField
                label={t("login.passphrase")}
                value={passphrase}
                onChangeText={(value) => {
                  setPassphrase(value);
                  setError(null);
                }}
                onSubmitEditing={submit}
                error={error}
                secureTextEntry
                autoComplete="password"
                autoCapitalize="none"
                returnKeyType="done"
                placeholder={t("login.passphrasePlaceholder")}
              />

              <Button
                label={t("login.unlock")}
                onPress={submit}
                loading={busy}
                disabled={passphrase.length === 0}
              />

              <AppText muted style={styles.footnote}>
                {t("login.otherIdentity")}{" "}
                <Link href="/restore" replace>
                  <AppText weight="semiBold" style={styles.link}>
                    {t("login.recoverWithKey")}
                  </AppText>
                </Link>
              </AppText>
            </>
          ) : (
            <>
              <View style={styles.features}>
                <Feature icon="shield" label={t("login.featureE2e")} />
                <Feature
                  icon="message-circle"
                  label={t("login.featureAnonymous")}
                />
                <Feature icon="video" label={t("login.featureCalls")} />
              </View>

              <Button
                label={t("login.createIdentity")}
                onPress={() => router.push("/register")}
              />
              <Button
                label={t("login.recoverWithKey")}
                variant="secondary"
                onPress={() => router.push("/restore")}
                style={styles.secondaryCta}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.languageBar}>
        <LanguagePill />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing(6),
    paddingTop: spacing(8),
    paddingBottom: spacing(12),
  },
  languageBar: {
    paddingBottom: spacing(2),
    alignItems: "center",
  },
  features: {
    marginBottom: spacing(8),
  },
  feature: {
    marginTop: spacing(3),
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: spacing(3),
    backgroundColor: PRIMARY_TINT,
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    flex: 1,
    fontSize: 14,
  },
  secondaryCta: {
    marginTop: spacing(3),
  },
  biometricBlock: {
    marginBottom: spacing(2),
  },
  notice: {
    marginTop: spacing(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  noticeText: {
    marginLeft: spacing(1.5),
    fontSize: 12,
    color: colors.danger,
    textAlign: "center",
  },
  divider: {
    marginTop: spacing(5),
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.overlay,
  },
  dividerText: {
    marginHorizontal: spacing(3),
    fontSize: 12,
  },
  footnote: {
    marginTop: spacing(5),
    fontSize: 13,
    textAlign: "center",
  },
  link: {
    fontSize: 13,
    color: colors.primary,
  },
});

export default LoginScreen;
