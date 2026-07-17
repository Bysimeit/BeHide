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
  validatePrivateKey,
  validatePseudo,
  type ValidationCode,
} from "../../auth/identity";

const RestoreScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { restore } = useAuth();

  const [pseudo, setPseudo] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [codes, setCodes] = useState<Record<string, ValidationCode | null>>({});
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const message = (code: ValidationCode | null | undefined) =>
    code
      ? t(`validation.${code}`, {
          ...VALIDATION_PARAMS,
          keyGiven: privateKey.trim().length,
        })
      : null;

  const submit = async () => {
    const nextCodes: Record<string, ValidationCode | null> = {
      pseudo: validatePseudo(pseudo),
      privateKey: validatePrivateKey(privateKey),
      passphrase: validatePassphrase(passphrase),
      confirmation: confirmation === passphrase ? null : "passphraseMismatch",
    };
    setCodes(nextCodes);
    setFailed(false);

    if (Object.values(nextCodes).some(Boolean)) return;

    setBusy(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 0));
    try {
      await restore(pseudo, privateKey, passphrase);
      router.replace("/");
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
        title={t("restore.loadingTitle")}
        message={t("restore.loadingMessage")}
      />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AuthHeader
            title={t("restore.title")}
            subtitle={t("restore.subtitle")}
          />

          <TextField
            label={t("restore.pseudo")}
            value={pseudo}
            onChangeText={setPseudo}
            error={message(codes.pseudo)}
            hint={t("restore.pseudoHint")}
            maxLength={PSEUDO_MAX_LENGTH}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={t("restore.pseudoPlaceholder")}
          />

          <TextField
            label={t("restore.privateKey")}
            value={privateKey}
            onChangeText={(value) => {
              setPrivateKey(value);
              setCodes((current) => ({ ...current, privateKey: null }));
              setFailed(false);
            }}
            error={failed ? t("restore.failed") : message(codes.privateKey)}
            hint={t("restore.privateKeyHint", VALIDATION_PARAMS)}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            style={styles.keyInput}
            placeholder={t("restore.privateKeyPlaceholder")}
          />

          <TextField
            label={t("restore.passphrase")}
            value={passphrase}
            onChangeText={setPassphrase}
            error={message(codes.passphrase)}
            hint={t("restore.passphraseHint", VALIDATION_PARAMS)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
          />

          <TextField
            label={t("restore.confirm")}
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
            <Feather name="shield" size={16} color={colors.primary} />
            <AppText muted style={styles.noticeText}>
              {t("restore.notice")}
            </AppText>
          </View>

          <Button
            label={t("restore.submit")}
            onPress={submit}
            loading={busy}
          />

          <AppText muted style={styles.footnote}>
            {t("restore.rememberPassphrase")}{" "}
            <Link href="/login" replace>
              <AppText weight="semiBold" style={styles.link}>
                {t("restore.unlock")}
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
  keyInput: {
    height: 76,
    paddingTop: spacing(3),
    textAlignVertical: "top",
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

export default RestoreScreen;
