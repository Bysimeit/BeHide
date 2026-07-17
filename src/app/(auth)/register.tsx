import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { LoadingOverlay } from "../../components/ui/LoadingOverlay";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { colors, radius, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { useAuth } from "../../auth/AuthContext";
import {
  PSEUDO_MAX_LENGTH,
  VALIDATION_PARAMS,
  validatePassphrase,
  validatePseudo,
  type ValidationCode,
} from "../../auth/identity";

const RegisterScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { register } = useAuth();

  const [pseudo, setPseudo] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [codes, setCodes] = useState<Record<string, ValidationCode | null>>({});
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const message = (code: ValidationCode | null | undefined) =>
    code ? t(`validation.${code}`, VALIDATION_PARAMS) : null;

  const submit = async () => {
    const nextCodes: Record<string, ValidationCode | null> = {
      pseudo: validatePseudo(pseudo),
      passphrase: validatePassphrase(passphrase),
      confirmation:
        confirmation === passphrase ? null : "passphraseMismatch",
    };
    setCodes(nextCodes);
    setFailed(false);

    if (Object.values(nextCodes).some(Boolean)) return;

    setBusy(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 0));
    try {
      await register(pseudo, passphrase);
      router.replace("/recovery");
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <LoadingOverlay
        visible={busy}
        title={t("register.loadingTitle")}
        message={t("register.loadingMessage")}
      />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AuthHeader
            title={t("register.title")}
            subtitle={t("register.subtitle")}
          />

          <TextField
            label={t("register.pseudo")}
            value={pseudo}
            onChangeText={setPseudo}
            error={failed ? t("register.failed") : message(codes.pseudo)}
            hint={t("register.pseudoHint")}
            maxLength={PSEUDO_MAX_LENGTH}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={t("register.pseudoPlaceholder")}
          />

          <TextField
            label={t("register.passphrase")}
            value={passphrase}
            onChangeText={setPassphrase}
            error={message(codes.passphrase)}
            hint={t("register.passphraseHint", VALIDATION_PARAMS)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
          />

          <TextField
            label={t("register.confirm")}
            value={confirmation}
            onChangeText={setConfirmation}
            onSubmitEditing={submit}
            error={message(codes.confirmation)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            returnKeyType="done"
          />

          <View style={styles.notice}>
            <Feather name="alert-circle" size={16} color={colors.primary} />
            <AppText muted style={styles.noticeText}>
              {t("register.notice")}
            </AppText>
          </View>

          <Button
            label={t("register.submit")}
            onPress={submit}
            loading={busy}
          />

          <AppText muted style={styles.footnote}>
            {t("register.haveIdentity")}{" "}
            <Link href="/login" replace>
              <AppText weight="semiBold" style={styles.link}>
                {t("register.unlock")}
              </AppText>
            </Link>
          </AppText>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: spacing(8),
  },
  notice: {
    marginBottom: spacing(5),
    padding: spacing(3.5),
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: "row",
  },
  noticeText: {
    flex: 1,
    marginLeft: spacing(2),
    fontSize: 12,
    lineHeight: 17,
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

export default RegisterScreen;
