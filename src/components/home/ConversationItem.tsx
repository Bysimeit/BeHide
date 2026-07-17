import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../../constants/theme";
import { useDateFormat, useTranslate } from "../../i18n";
import type { Conversation } from "../../types";
import { displayName } from "../../data/store";
import { AppText } from "../ui/AppText";
import { Avatar } from "../ui/Avatar";

type ConversationItemProps = {
  conversation: Conversation;
  onPress: () => void;
};

export const ConversationItem = ({
  conversation,
  onPress,
}: ConversationItemProps) => {
  const t = useTranslate();
  const { formatDate, formatRelativeDateTime } = useDateFormat();
  const { contact, lastMessage, isSeen, unreadCount } = conversation;
  const blockedByThem = contact.blockedAt !== null;
  const blockedByMe = contact.blockedByMeAt !== null;
  const isBlocked = blockedByThem || blockedByMe;

  const subtitle = blockedByThem
    ? t("home.blockedByThem", { date: formatDate(contact.blockedAt!) })
    : blockedByMe
      ? t("home.blockedByMe")
      : lastMessage
        ? formatRelativeDateTime(lastMessage.sentAt)
        : t("home.noMessage");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("home.conversationWith", {
        name: displayName(contact),
      })}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: isBlocked ? colors.danger : colors.primary },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <Avatar
          size={50}
          firstName={contact.firstName}
          lastName={contact.lastName}
        />
        <View style={styles.infos}>
          <AppText weight="semiBold" style={styles.name} numberOfLines={1}>
            {displayName(contact)}
          </AppText>
          <AppText style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </AppText>
        </View>
      </View>

      <View style={styles.right}>
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <AppText weight="semiBold" style={styles.badgeText}>
              {unreadCount}
            </AppText>
          </View>
        ) : (
          <Ionicons
            name="chatbox-outline"
            size={24}
            color={colors.textOnPrimary}
          />
        )}
        <AppText
          weight="medium"
          style={[styles.status, { opacity: isSeen ? 1 : 0.5 }]}
        >
          {t("home.seen")}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing(2.5),
    padding: spacing(2.5),
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pressed: {
    opacity: 0.85,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infos: {
    flex: 1,
    marginLeft: spacing(3),
  },
  name: {
    fontSize: 18,
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text,
  },
  right: {
    marginLeft: spacing(2),
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    marginLeft: spacing(1.5),
    fontSize: 13,
    color: colors.textOnPrimary,
  },
  badge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing(1.5),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    color: colors.primary,
  },
});
