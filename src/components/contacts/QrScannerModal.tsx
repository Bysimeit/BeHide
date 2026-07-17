import { useEffect, useRef, useState } from "react";
import { Linking, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import {
  decodeIdentityToken,
  type SharedIdentity,
} from "../../p2p/identityToken";
import { AppText } from "../ui/AppText";
import { Button } from "../ui/Button";

type QrScannerModalProps = {
  visible: boolean;
  onClose: () => void;
  onScanned: (identity: SharedIdentity) => void;
};

export const QrScannerModal = ({
  visible,
  onClose,
  onScanned,
}: QrScannerModalProps) => {
  const t = useTranslate();
  const [permission, requestPermission] = useCameraPermissions();
  const [invalid, setInvalid] = useState(false);
  const handled = useRef(false);

  useEffect(() => {
    if (!visible) return;
    handled.current = false;
    setInvalid(false);
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onBarcode = ({ data }: { data: string }) => {
    if (handled.current) return;
    const shared = decodeIdentityToken(data);
    if (!shared) {
      setInvalid(true);
      return;
    }
    handled.current = true;
    onScanned(shared);
    onClose();
  };

  const granted = permission?.granted ?? false;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.screen}>
        <StatusBar style="light" />

        {granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={onBarcode}
          />
        ) : null}

        <SafeAreaView style={styles.overlay}>
          <View style={styles.topBar}>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t("qr.scannerClose")}
              hitSlop={12}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Feather name="x" size={22} color={colors.textOnPrimary} />
            </Pressable>
            <AppText weight="semiBold" style={styles.topTitle}>
              {t("qr.scannerTitle")}
            </AppText>
          </View>

          {granted ? (
            <>
              <View style={styles.frameArea}>
                <View style={styles.frame} />
              </View>
              <View style={styles.footer}>
                <AppText style={styles.hint}>
                  {invalid ? t("qr.scannerInvalid") : t("qr.scannerHint")}
                </AppText>
              </View>
            </>
          ) : (
            <View style={styles.denied}>
              <Feather
                name="camera-off"
                size={32}
                color={colors.textOnPrimary}
              />
              <AppText style={styles.deniedText}>
                {permission && !permission.canAskAgain
                  ? t("qr.cameraBlocked")
                  : t("qr.cameraNeeded")}
              </AppText>
              <Button
                label={
                  permission && !permission.canAskAgain
                    ? t("qr.openSettings")
                    : t("qr.allowCamera")
                }
                variant="secondary"
                onPress={() => {
                  if (permission && !permission.canAskAgain) {
                    void Linking.openSettings();
                  } else {
                    void requestPermission();
                  }
                }}
                style={styles.deniedButton}
              />
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const FRAME = 240;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    marginTop: spacing(2),
    paddingHorizontal: spacing(5),
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  topTitle: {
    marginLeft: spacing(3),
    fontSize: 17,
    color: colors.textOnPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  frameArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: FRAME,
    height: FRAME,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.textOnPrimary,
    backgroundColor: "transparent",
  },
  footer: {
    padding: spacing(6),
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: colors.textOnPrimary,
  },
  denied: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing(8),
  },
  deniedText: {
    marginTop: spacing(4),
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: colors.textOnPrimary,
  },
  deniedButton: {
    marginTop: spacing(6),
    alignSelf: "stretch",
  },
});
