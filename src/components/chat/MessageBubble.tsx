import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../../constants/theme";
import { useDateFormat, useTranslate } from "../../i18n";
import type { Message } from "../../types";
import { openLink, splitBody } from "../../utils/links";
import { AppText } from "../ui/AppText";
import { MediaAttachment } from "./MediaAttachment";

export const MessageBubble = ({ message }: { message: Message }) => {
  const { formatTime } = useDateFormat();
  const t = useTranslate();
  const { isOwn, body, sentAt, media } = message;
  const segments = useMemo(() => splitBody(body), [body]);

  return (
    <View
      style={[
        styles.container,
        { alignSelf: isOwn ? "flex-end" : "flex-start" },
      ]}
    >
      <View
        style={[
          styles.bubble,
          media != null && styles.mediaBubble,
          {
            backgroundColor: isOwn
              ? colors.bubbleOutgoing
              : colors.bubbleIncoming,
          },
        ]}
      >
        {media != null ? <MediaAttachment message={message} /> : null}
        {body.length > 0 ? (
          <AppText
            selectable
            style={[styles.body, media != null && styles.caption]}
          >
            {segments.map((segment, index) =>
              segment.kind === "link" ? (
                <AppText
                  key={`${index}-${segment.url}`}
                  weight="medium"
                  style={[styles.body, styles.link]}
                  accessibilityRole="link"
                  accessibilityLabel={t("chat.openLink", { url: segment.url })}
                  onPress={() => openLink(segment.url)}
                >
                  {segment.text}
                </AppText>
              ) : (
                segment.text
              ),
            )}
          </AppText>
        ) : null}
      </View>
      <AppText
        muted
        style={[styles.time, { alignSelf: isOwn ? "flex-end" : "flex-start" }]}
      >
        {formatTime(sentAt)}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "85%",
    marginTop: spacing(2),
  },
  bubble: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3),
    borderRadius: radius.md,
  },
  mediaBubble: {
    padding: spacing(1.5),
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  link: {
    textDecorationLine: "underline",
  },
  time: {
    marginTop: spacing(0.5),
    paddingHorizontal: spacing(3),
    fontSize: 11,
  },
});
