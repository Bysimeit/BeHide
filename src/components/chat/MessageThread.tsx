import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing } from "../../constants/theme";
import { useDateFormat, useTranslate } from "../../i18n";
import type { Message } from "../../types";
import { dayKey } from "../../utils/datetime";
import { AppText } from "../ui/AppText";
import { MessageBubble } from "./MessageBubble";

type Row =
  | { kind: "day"; id: string; iso: string }
  | { kind: "message"; id: string; message: Message }
  | { kind: "readMark"; id: string };

const lastReadOwnId = (messages: Message[]): string | null => {
  const own = messages.filter((m) => m.isOwn);
  const lastRead = own.filter((m) => m.readAt).at(-1);
  if (!lastRead) return null;
  return lastRead.id === messages.at(-1)?.id ? null : lastRead.id;
};

const toRows = (messages: Message[], readMarkAfter: string | null): Row[] => {
  const rows: Row[] = [];
  let currentDay: string | null = null;

  for (const message of messages) {
    const day = dayKey(message.sentAt);
    if (day !== currentDay) {
      rows.push({ kind: "day", id: `day-${day}`, iso: message.sentAt });
      currentDay = day;
    }
    rows.push({ kind: "message", id: message.id, message });
    if (message.id === readMarkAfter) {
      rows.push({ kind: "readMark", id: `read-${message.id}` });
    }
  }

  return rows;
};

const PAGE_SIZE = 50;

type MessageThreadProps = {
  messages: Message[];
  showReadMark?: boolean;
};

export const MessageThread = ({
  messages,
  showReadMark = false,
}: MessageThreadProps) => {
  const t = useTranslate();
  const { formatDayHeader } = useDateFormat();
  const [count, setCount] = useState(PAGE_SIZE);

  const visible = useMemo(
    () => messages.slice(Math.max(0, messages.length - count)),
    [messages, count],
  );

  const rows = useMemo(
    () => toRows(visible, showReadMark ? lastReadOwnId(visible) : null).reverse(),
    [visible, showReadMark],
  );

  const loadOlder = () => {
    setCount((current) =>
      current < messages.length ? current + PAGE_SIZE : current,
    );
  };

  if (messages.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <AppText muted style={styles.empty}>
          {t("chat.empty")}
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={rows}
      keyExtractor={(row) => row.id}
      inverted
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onEndReached={loadOlder}
      onEndReachedThreshold={0.4}
      renderItem={({ item }) => {
        if (item.kind === "day") {
          return (
            <View style={styles.day}>
              <AppText muted style={styles.dayText}>
                {formatDayHeader(item.iso)}
              </AppText>
            </View>
          );
        }
        if (item.kind === "readMark") {
          return (
            <View style={styles.readMark}>
              <View style={styles.readLine} />
              <View style={styles.readBadge}>
                <Feather name="eye" size={11} color={colors.primary} />
                <AppText weight="medium" style={styles.readText}>
                  {t("chat.readMark")}
                </AppText>
              </View>
              <View style={styles.readLine} />
            </View>
          );
        }
        return <MessageBubble message={item.message} />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3),
  },
  day: {
    marginTop: spacing(4),
    marginBottom: spacing(1),
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
  },
  readMark: {
    marginVertical: spacing(2),
    flexDirection: "row",
    alignItems: "center",
  },
  readLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.primary,
    opacity: 0.35,
  },
  readBadge: {
    marginHorizontal: spacing(2),
    flexDirection: "row",
    alignItems: "center",
  },
  readText: {
    marginLeft: spacing(1),
    fontSize: 11,
    letterSpacing: 0.3,
    color: colors.primary,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing(4),
  },
  empty: {
    textAlign: "center",
  },
});
