import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { MessageThread } from "../../components/chat/MessageThread";
import { MessageComposer } from "../../components/chat/MessageComposer";
import { colors, radius, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { displayName, useAppData } from "../../data/store";

const ChatScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const {
    contactById,
    messagesOf,
    sendMessage,
    markConversationRead,
    settings,
    connection,
  } = useAppData();

  const contact = contactById(id);
  const messages = messagesOf(id);

  useEffect(() => {
    if (contact) markConversationRead(id);
  }, [id, contact, messages.length, markConversationRead]);

  const blockedByThem = contact?.blockedAt != null;
  const blockedByMe = contact?.blockedByMeAt != null;

  const connectionMeta = {
    connected: { label: t("chat.connected"), color: "#2E9E5B" },
    connecting: { label: t("chat.connecting"), color: colors.textMuted },
    disconnected: { label: t("chat.disconnected"), color: colors.danger },
  }[connection];

  if (!contact) {
    return (
      <Screen style={styles.notFound}>
        <AppText weight="semiBold">{t("chat.notFound")}</AppText>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <AppText weight="medium" style={styles.backLinkText}>
            {t("common.back")}
          </AppText>
        </Pressable>
      </Screen>
    );
  }

  const send = (body: string) => sendMessage(id, body);

  return (
    <Screen
      style={[styles.screen, { paddingBottom: insets.bottom + spacing(2) }]}
    >
      {

      }
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t("chat.backToConversations")}
            hitSlop={12}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>

          <View style={styles.avatarFrame}>
            <Avatar
              size={64}
              firstName={contact.firstName}
              lastName={contact.lastName}
            />
          </View>

          <View style={styles.identity}>
            <AppText weight="bold" style={styles.name} numberOfLines={2}>
              {displayName(contact)}
            </AppText>
            <AppText muted style={styles.fingerprint} numberOfLines={1}>
              {contact.fingerprint}
            </AppText>
          </View>
        </View>

        <View style={styles.secure}>
          <MaterialIcons
            name="lock-outline"
            size={18}
            color={colors.textMuted}
          />
          <AppText muted style={styles.secureText}>
            {t("chat.secure")}
          </AppText>
          <View
            style={[styles.dot, { backgroundColor: connectionMeta.color }]}
          />
          <AppText style={[styles.secureText, { color: connectionMeta.color }]}>
            {connectionMeta.label}
          </AppText>
        </View>

        <View style={styles.chatBox}>
          <MessageThread
            messages={messages}
            showReadMark={settings.readReceipts}
          />
          {blockedByMe || blockedByThem ? (
            <View style={styles.blockedBar}>
              <Feather name="slash" size={15} color={colors.danger} />
              <AppText style={styles.blockedText}>
                {blockedByMe ? t("chat.blockedByMe") : t("chat.blockedByThem")}
              </AppText>
            </View>
          ) : (
            <MessageComposer onSend={send} />
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing(5),
  },
  flex: {
    flex: 1,
  },
  notFound: {
    alignItems: "center",
    justifyContent: "center",
  },
  backLink: {
    marginTop: spacing(3),
  },
  backLinkText: {
    color: colors.primary,
  },
  header: {
    marginTop: spacing(6),
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    marginRight: spacing(1),
  },
  avatarFrame: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginRight: spacing(4),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  identity: {
    flex: 1,
  },
  name: {
    fontSize: 26,
  },
  fingerprint: {
    fontSize: 12,
  },
  secure: {
    marginVertical: spacing(1.5),
    paddingRight: spacing(2),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  secureText: {
    marginLeft: spacing(1),
    fontSize: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginLeft: spacing(2),
  },
  chatBox: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  blockedBar: {
    padding: spacing(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.overlay,
  },
  blockedText: {
    marginLeft: spacing(2),
    flexShrink: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
});

export default ChatScreen;
