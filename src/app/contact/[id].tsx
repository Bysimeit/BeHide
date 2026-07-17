import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { colors, radius, spacing } from "../../constants/theme";
import { useDateFormat, useTranslate } from "../../i18n";
import { displayName, useAppData } from "../../data/store";

type StatProps = {
  icon: keyof typeof Feather.glyphMap;
  value: string;
  label: string;
};

const Stat = ({ icon, value, label }: StatProps) => (
  <View style={styles.stat}>
    <Feather name={icon} size={20} color={colors.primary} />
    <AppText weight="bold" style={styles.statValue}>
      {value}
    </AppText>
    <AppText muted style={styles.statLabel}>
      {label}
    </AppText>
  </View>
);

const ContactDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslate();
  const { formatDate, formatDuration } = useDateFormat();
  const { contactById, statsOf, toggleBlockContact, removeContact } =
    useAppData();

  const contact = contactById(id);

  if (!contact) {
    return (
      <Screen style={styles.screen}>
        <ScreenHeader
          title={t("contactDetail.fallbackTitle")}
          onBack={() => router.back()}
        />
        <AppText muted style={styles.missing}>
          {t("contactDetail.missing")}
        </AppText>
      </Screen>
    );
  }

  const stats = statsOf(id);
  const blockedByThem = contact.blockedAt !== null;
  const blockedByMe = contact.blockedByMeAt !== null;

  const confirmDelete = () => {
    Alert.alert(
      t("contactDetail.deleteTitle"),
      t("contactDetail.deleteMessage", { name: displayName(contact) }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            removeContact(id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <Screen style={styles.screen}>
      <ScreenHeader
        title={t("contactDetail.title")}
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <Avatar
            size={96}
            firstName={contact.firstName}
            lastName={contact.lastName}
          />
          <AppText weight="bold" style={styles.name}>
            {displayName(contact)}
          </AppText>
          <AppText muted style={styles.fingerprint}>
            {contact.fingerprint}
          </AppText>
        </View>

        {blockedByThem && (
          <View style={styles.banner}>
            <Feather name="slash" size={16} color={colors.danger} />
            <AppText style={styles.bannerText}>
              {t("contactDetail.blockedBanner", {
                date: formatDate(contact.blockedAt!),
              })}
            </AppText>
          </View>
        )}

        <View style={styles.stats}>
          <Stat
            icon="send"
            value={String(stats.messagesSent)}
            label={t("contactDetail.messagesSent")}
          />
          <Stat
            icon="inbox"
            value={String(stats.messagesReceived)}
            label={t("contactDetail.messagesReceived")}
          />
          <Stat
            icon="phone"
            value={String(stats.callCount)}
            label={
              stats.callCount > 1
                ? t("contactDetail.callsPlural")
                : t("contactDetail.call")
            }
          />
          <Stat
            icon="clock"
            value={formatDuration(stats.callSeconds)}
            label={t("contactDetail.callTime")}
          />
        </View>

        <View style={styles.actions}>
          <Button
            label={t("contactDetail.sendMessage")}
            onPress={() => router.push(`/chat/${id}`)}
            disabled={blockedByThem || blockedByMe}
          />
          <Button
            label={
              blockedByMe
                ? t("contactDetail.unblock")
                : t("contactDetail.block")
            }
            variant="secondary"
            onPress={() => toggleBlockContact(id)}
            style={styles.action}
          />
          <Button
            label={t("contactDetail.delete")}
            variant="ghost"
            onPress={confirmDelete}
            style={styles.action}
          />
        </View>

        {blockedByMe && (
          <AppText muted style={styles.blockedHint}>
            {t("contactDetail.blockedHint")}
          </AppText>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing(5),
  },
  content: {
    paddingBottom: spacing(8),
  },
  missing: {
    marginTop: spacing(8),
    textAlign: "center",
  },
  identity: {
    marginTop: spacing(2),
    alignItems: "center",
  },
  name: {
    marginTop: spacing(3),
    fontSize: 24,
    textAlign: "center",
  },
  fingerprint: {
    marginTop: spacing(0.5),
    fontSize: 13,
  },
  banner: {
    marginTop: spacing(5),
    padding: spacing(3.5),
    borderRadius: radius.md,
    backgroundColor: "rgba(229, 72, 77, 0.08)",
    flexDirection: "row",
    alignItems: "center",
  },
  bannerText: {
    flex: 1,
    marginLeft: spacing(2),
    fontSize: 13,
    color: colors.danger,
  },
  stats: {
    marginTop: spacing(6),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  stat: {
    width: "48%",
    marginBottom: spacing(3),
    paddingVertical: spacing(4),
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  statValue: {
    marginTop: spacing(1.5),
    fontSize: 22,
  },
  statLabel: {
    marginTop: spacing(0.5),
    fontSize: 12,
    textAlign: "center",
  },
  actions: {
    marginTop: spacing(3),
  },
  action: {
    marginTop: spacing(3),
  },
  blockedHint: {
    marginTop: spacing(4),
    paddingHorizontal: spacing(2),
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
});

export default ContactDetailScreen;
