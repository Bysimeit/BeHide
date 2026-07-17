import { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { QrScannerModal } from "../../components/contacts/QrScannerModal";
import { colors, radius, spacing } from "../../constants/theme";
import {
  decodeIdentityToken,
  encodeIdentityToken,
} from "../../p2p/identityToken";
import { useTranslate } from "../../i18n";
import { useAppData } from "../../data/store";

const AddContactScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { addContact, contacts } = useAppData();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [scannerVisible, setScannerVisible] = useState(false);

  const submit = () => {
    const shared = decodeIdentityToken(publicKey);

    const nextErrors: Record<string, string | null> = {
      firstName: firstName.trim() ? null : t("contactNew.nameRequired"),
      publicKey: !publicKey.trim()
        ? t("contactNew.keyRequired")
        : !shared
          ? t("contactNew.keyInvalid")
          : contacts.some((c) => c.publicKey === shared.publicKey)
            ? t("contactNew.keyDuplicate")
            : null,
    };
    setErrors(nextErrors);

    if (!shared || Object.values(nextErrors).some(Boolean)) return;

    const contact = addContact({
      firstName,
      lastName,
      publicKey: shared.publicKey,
      exchangePublicKey: shared.exchangePublicKey,
    });
    router.replace({ pathname: "/contact/[id]", params: { id: contact.id } });
  };

  return (
    <Screen style={styles.screen}>
      <ScreenHeader title={t("contactNew.title")} onBack={() => router.back()} />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.notice}>
            <Feather name="key" size={16} color={colors.primary} />
            <AppText muted style={styles.noticeText}>
              {t("contactNew.notice")}
            </AppText>
          </View>

          <TextField
            label={t("contactNew.firstName")}
            value={firstName}
            onChangeText={setFirstName}
            error={errors.firstName}
            autoCapitalize="words"
            placeholder={t("contactNew.firstNamePlaceholder")}
          />

          <TextField
            label={t("contactNew.lastName")}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            placeholder={t("contactNew.lastNamePlaceholder")}
          />

          <TextField
            label={t("contactNew.key")}
            value={publicKey}
            onChangeText={(value) => {
              setPublicKey(value);
              setErrors((e) => ({ ...e, publicKey: null }));
            }}
            error={errors.publicKey}
            hint={t("contactNew.keyHint")}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            style={styles.keyInput}
            placeholder="behide:v1:…"
          />

          <Pressable
            onPress={() => setScannerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t("contactNew.scan")}
            style={({ pressed }) => [styles.scanButton, pressed && styles.pressed]}
          >
            <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
            <AppText weight="semiBold" style={styles.scanLabel}>
              {t("contactNew.scan")}
            </AppText>
          </Pressable>

          <Button label={t("contactNew.submit")} onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>

      <QrScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={(shared) => {
          setPublicKey(encodeIdentityToken(shared));
          setErrors((e) => ({ ...e, publicKey: null }));
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing(5),
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: spacing(4),
    paddingBottom: spacing(8),
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
  keyInput: {
    height: 76,
    paddingTop: spacing(3),
    textAlignVertical: "top",
  },
  scanButton: {
    marginTop: spacing(3),
    marginBottom: spacing(5),
    paddingVertical: spacing(3.5),
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanLabel: {
    marginLeft: spacing(2),
    fontSize: 14,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default AddContactScreen;
