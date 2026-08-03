import { Alert } from "react-native";
import { MAX_MEDIA_BYTES } from "../constants/config";
import type { Translate } from "../i18n";
import { pickMedia, type PickedMedia, type PickSource } from "./picker";

const megabytes = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

const chooseSource = (t: Translate): Promise<PickSource | null> =>
  new Promise((resolve) => {
    Alert.alert(
      t("chat.attachTitle"),
      undefined,
      [
        { text: t("chat.attachLibrary"), onPress: () => resolve("library") },
        { text: t("chat.attachCamera"), onPress: () => resolve("camera") },
        {
          text: t("common.cancel"),
          style: "cancel",
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });

export const attachMedia = async (
  t: Translate,
): Promise<PickedMedia | null> => {
  const source = await chooseSource(t);
  if (!source) return null;

  const outcome = await pickMedia(source);

  switch (outcome.status) {
    case "picked":
      return outcome.media;
    case "too-large":
      Alert.alert(
        t("chat.mediaTooLargeTitle"),
        t("chat.mediaTooLargeMessage", {
          size: megabytes(outcome.bytes),
          limit: megabytes(MAX_MEDIA_BYTES),
        }),
      );
      return null;
    case "denied":
      Alert.alert(t("chat.mediaDeniedTitle"), t("chat.mediaDeniedMessage"));
      return null;
    case "unreadable":
      Alert.alert(
        t("chat.mediaUnreadableTitle"),
        t("chat.mediaUnreadableMessage"),
      );
      return null;
    case "unavailable":
      Alert.alert(
        t("chat.mediaUnsupportedTitle"),
        t("chat.mediaUnsupportedMessage"),
      );
      return null;
    default:
      return null;
  }
};
