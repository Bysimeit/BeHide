import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { VideoSurface } from "../../components/media/VideoSurface";
import { colors, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { useAppData } from "../../data/store";
import { useMediaSource } from "../../media/useMediaSource";

const MediaScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const { messageById } = useAppData();

  const message = messageById(id);
  const source = useMediaSource(message);
  const media = message?.media ?? null;

  return (
    <View style={styles.screen}>
      {!media || source.status === "missing" ? (
        <View style={styles.center}>
          <AppText style={styles.notice}>{t("chat.mediaUnavailable")}</AppText>
        </View>
      ) : source.status === "loading" ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.textOnPrimary} />
        </View>
      ) : media.kind === "video" ? (
        <VideoSurface
          uri={source.uri}
          unavailableLabel={t("chat.mediaPlayerUnavailable")}
        />
      ) : (
        <Image
          source={{ uri: source.uri }}
          style={styles.image}
          contentFit="contain"
          transition={120}
        />
      )}

      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={t("common.close")}
        hitSlop={12}
        style={[styles.close, { top: insets.top + spacing(3) }]}
      >
        <Ionicons name="close" size={26} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.text,
  },
  center: {
    flex: 1,
    paddingHorizontal: spacing(6),
    alignItems: "center",
    justifyContent: "center",
  },
  notice: {
    textAlign: "center",
    color: colors.textOnPrimary,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  close: {
    position: "absolute",
    right: spacing(4),
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MediaScreen;
