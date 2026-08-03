import { lazy, Suspense } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";
import { colors, spacing } from "../../constants/theme";
import { AppText } from "../ui/AppText";

type VideoSurfaceProps = {
  uri: string;
  unavailableLabel: string;
};

const Unavailable = ({ unavailableLabel }: VideoSurfaceProps) => (
  <View style={styles.fallback}>
    <AppText style={styles.fallbackText}>{unavailableLabel}</AppText>
  </View>
);

const Player = lazy(async () => {
  if (!requireOptionalNativeModule("ExpoVideo")) return { default: Unavailable };

  try {
    const { VideoView, useVideoPlayer } = await import("expo-video");

    const Native = ({ uri }: VideoSurfaceProps) => {
      const player = useVideoPlayer(uri, (instance) => {
        instance.loop = false;
        instance.play();
      });

      return (
        <VideoView
          style={styles.video}
          player={player}
          contentFit="contain"
          nativeControls
          fullscreenOptions={{ enable: true }}
        />
      );
    };

    return { default: Native };
  } catch (error) {
    console.warn("Lecteur vidéo indisponible :", error);
    return { default: Unavailable };
  }
});

export const VideoSurface = (props: VideoSurfaceProps) => (
  <Suspense
    fallback={
      <View style={styles.fallback}>
        <ActivityIndicator color={colors.textOnPrimary} />
      </View>
    }
  >
    <Player {...props} />
  </Suspense>
);

const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: "100%",
  },
  fallback: {
    flex: 1,
    paddingHorizontal: spacing(6),
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    textAlign: "center",
    color: colors.textOnPrimary,
  },
});
