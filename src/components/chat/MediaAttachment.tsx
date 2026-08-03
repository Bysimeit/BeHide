import { ActivityIndicator, Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { useAppData } from "../../data/store";
import { useMediaSource } from "../../media/useMediaSource";
import { formatClock } from "../../utils/datetime";
import type { Message } from "../../types";
import { AppText } from "../ui/AppText";

const MAX_WIDTH = Math.min(260, Dimensions.get("window").width * 0.6);
const MAX_HEIGHT = 320;
const MIN_WIDTH = 140;

const frameSize = (width: number, height: number) => {
  if (!width || !height) return { width: MAX_WIDTH, height: MAX_WIDTH };
  const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
  return {
    width: Math.max(MIN_WIDTH, Math.round(width * scale)),
    height: Math.max(MIN_WIDTH, Math.round(height * scale)),
  };
};

export const MediaAttachment = ({ message }: { message: Message }) => {
  const t = useTranslate();
  const router = useRouter();
  const { mediaProgress, retryMedia } = useAppData();
  const source = useMediaSource(message);

  const media = message.media;
  if (!media) return null;

  const size = frameSize(media.width, media.height);
  const isVideo = media.kind === "video";
  const label = t(isVideo ? "chat.mediaVideo" : "chat.mediaImage");

  if (message.mediaStatus === "transferring") {
    const ratio = mediaProgress[message.id] ?? 0;
    return (
      <View style={[styles.tile, size]}>
        <ActivityIndicator color={colors.textOnPrimary} />
        <AppText style={styles.tileText}>
          {t(message.isOwn ? "chat.mediaSending" : "chat.mediaReceiving", {
            percent: Math.round(ratio * 100),
          })}
        </AppText>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%` }]} />
        </View>
      </View>
    );
  }

  if (message.mediaStatus === "failed") {
    return (
      <View style={[styles.tile, size]}>
        <Feather name="alert-triangle" size={24} color={colors.textOnPrimary} />
        <AppText style={styles.tileText}>{t("chat.mediaFailed")}</AppText>
        {message.isOwn ? (
          <Pressable
            onPress={() => void retryMedia(message.id)}
            accessibilityRole="button"
            style={styles.retry}
          >
            <AppText weight="medium" style={styles.retryText}>
              {t("chat.mediaRetry")}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (message.mediaStatus !== "ready" || source.status === "missing") {
    return (
      <View style={[styles.tile, size]}>
        <Feather name="eye-off" size={24} color={colors.textOnPrimary} />
        <AppText style={styles.tileText}>{t("chat.mediaUnavailable")}</AppText>
      </View>
    );
  }

  if (source.status === "loading") {
    return (
      <View style={[styles.tile, size]}>
        <ActivityIndicator color={colors.textOnPrimary} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/media/[id]", params: { id: message.id } })
      }
      accessibilityRole="imagebutton"
      accessibilityLabel={t("chat.mediaOpen", { kind: label })}
      style={({ pressed }) => [styles.frame, size, pressed && styles.pressed]}
    >
      {isVideo ? (
        <View style={[styles.tile, size, styles.videoTile]}>
          <View style={styles.play}>
            <Ionicons name="play" size={26} color={colors.primary} />
          </View>
          <AppText style={styles.tileText}>
            {media.durationMs
              ? formatClock(Math.round(media.durationMs / 1000))
              : label}
          </AppText>
        </View>
      ) : (
        <Image
          source={{ uri: source.uri }}
          style={size}
          contentFit="cover"
          transition={120}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  frame: {
    borderRadius: radius.sm,
    overflow: "hidden",
    backgroundColor: colors.overlay,
  },
  pressed: {
    opacity: 0.85,
  },
  tile: {
    paddingHorizontal: spacing(3),
    borderRadius: radius.sm,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  videoTile: {
    backgroundColor: colors.text,
  },
  tileText: {
    marginTop: spacing(2),
    fontSize: 13,
    textAlign: "center",
    color: colors.textOnPrimary,
  },
  track: {
    width: "80%",
    height: 4,
    marginTop: spacing(2),
    borderRadius: radius.pill,
    backgroundColor: colors.overlay,
    overflow: "hidden",
  },
  fill: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.textOnPrimary,
  },
  retry: {
    marginTop: spacing(2),
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  retryText: {
    fontSize: 13,
    color: colors.primary,
  },
  play: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
