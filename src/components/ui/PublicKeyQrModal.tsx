import { Modal, Pressable, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { encodeIdentityToken } from "../../p2p/identityToken";
import { AppText } from "./AppText";

type PublicKeyQrModalProps = {
  visible: boolean;
  publicKey: string;
  exchangePublicKey: string;
  onClose: () => void;
};

export const PublicKeyQrModal = ({
  visible,
  publicKey,
  exchangePublicKey,
  onClose,
}: PublicKeyQrModalProps) => {
  const t = useTranslate();
  const token =
    publicKey && exchangePublicKey
      ? encodeIdentityToken({ publicKey, exchangePublicKey })
      : "";

  return (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    statusBarTranslucent
    navigationBarTranslucent
    onRequestClose={onClose}
  >
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <AppText weight="semiBold" style={styles.title}>
          {t("qr.title")}
        </AppText>

        <AppText muted style={styles.subtitle}>
          {t("qr.subtitle")}
        </AppText>

        <AppText muted style={styles.key} selectable>
          {token}
        </AppText>

        <View style={styles.qrFrame}>
          {token ? (
            <QRCode
              value={token}
              size={200}
              color={colors.text}
              backgroundColor={colors.surface}
            />
          ) : null}
        </View>

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather name="x" size={18} color={colors.text} />
          <AppText weight="semiBold" style={styles.closeLabel}>
            {t("common.close")}
          </AppText>
        </Pressable>
      </View>
    </View>
  </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    padding: spacing(6),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  card: {
    width: "100%",
    maxWidth: 340,
    padding: spacing(6),
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing(2),
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  key: {
    marginTop: spacing(3),
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  qrFrame: {
    marginTop: spacing(5),
    padding: spacing(3),
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.overlay,
  },
  closeButton: {
    marginTop: spacing(6),
    paddingHorizontal: spacing(5),
    height: 44,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.overlay,
  },
  closeLabel: {
    marginLeft: spacing(2),
    fontSize: 14,
    color: colors.text,
  },
  pressed: {
    opacity: 0.7,
  },
});
