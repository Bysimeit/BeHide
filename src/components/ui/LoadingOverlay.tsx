import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../../constants/theme";
import { AppText } from "./AppText";

type LoadingOverlayProps = {
  visible: boolean;
  title: string;
  message?: string;
};

export const LoadingOverlay = ({
  visible,
  title,
  message,
}: LoadingOverlayProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="none"
    statusBarTranslucent
    navigationBarTranslucent
  >
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText weight="semiBold" style={styles.title}>
          {title}
        </AppText>
        {message ? (
          <AppText muted style={styles.message}>
            {message}
          </AppText>
        ) : null}
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    padding: spacing(8),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  card: {
    width: "100%",
    maxWidth: 320,
    padding: spacing(6),
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  title: {
    marginTop: spacing(4),
    fontSize: 16,
    textAlign: "center",
  },
  message: {
    marginTop: spacing(2),
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
});
