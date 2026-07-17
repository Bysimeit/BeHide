import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../../constants/theme";
import { useDateFormat } from "../../i18n";
import type { Message } from "../../types";
import { AppText } from "../ui/AppText";

export const MessageBubble = ({ message }: { message: Message }) => {
  const { formatTime } = useDateFormat();
  const { isOwn, body, sentAt } = message;

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
          {
            backgroundColor: isOwn
              ? colors.bubbleOutgoing
              : colors.bubbleIncoming,
          },
        ]}
      >
        <AppText style={styles.body}>{body}</AppText>
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
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  time: {
    marginTop: spacing(0.5),
    paddingHorizontal: spacing(3),
    fontSize: 11,
  },
});
