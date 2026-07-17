import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { colors, radius, spacing, TAB_BAR_HEIGHT } from "../../constants/theme";
import { useDateFormat, useTranslate } from "../../i18n";
import { displayName, useAppData } from "../../data/store";
import { useCall } from "../../call/CallContext";
import { isCallSupported } from "../../p2p/webrtc";
import type { CallDirection, Contact } from "../../types";

const ICONS: Record<CallDirection, keyof typeof Feather.glyphMap> = {
  incoming: "phone-incoming",
  outgoing: "phone-outgoing",
  missed: "phone-missed",
};

const CallsScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { formatDuration, formatRelativeDateTime } = useDateFormat();
  const { calls, contactById } = useAppData();
  const { startCall } = useCall();

  const recall = (contactId: string, video: boolean) => {
    if (!isCallSupported) {
      Alert.alert(
        t("calls.unavailableTitle"),
        t("calls.unavailableMessage"),
      );
      return;
    }
    if (!startCall(contactId, video)) return;
    router.push({ pathname: "/call/[id]", params: { id: contactId } });
  };

  const rows = calls
    .map((call) => ({ call, contact: contactById(call.contactId) }))
    .filter((row): row is { call: (typeof calls)[number]; contact: Contact } =>
      Boolean(row.contact),
    )
    .sort((a, b) => b.call.startedAt.localeCompare(a.call.startedAt));

  return (
    <Screen>
      <View style={styles.header}>
        <Feather name="phone" size={24} color={colors.text} />
        <AppText weight="semiBold" style={styles.title}>
          {t("calls.title")}
        </AppText>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.call.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: { call, contact } }) => {
          const isMissed = call.direction === "missed";
          const blocked =
            contact.blockedAt !== null || contact.blockedByMeAt !== null;
          return (
            <View style={styles.row}>
              <Avatar
                size={48}
                firstName={contact.firstName}
                lastName={contact.lastName}
              />
              <View style={styles.infos}>
                <AppText weight="semiBold" numberOfLines={1}>
                  {displayName(contact)}
                </AppText>
                <View style={styles.meta}>
                  <Feather
                    name={ICONS[call.direction]}
                    size={13}
                    color={isMissed ? colors.danger : colors.textMuted}
                  />
                  {call.video && (
                    <Feather
                      name="video"
                      size={13}
                      color={isMissed ? colors.danger : colors.textMuted}
                      style={styles.videoTag}
                    />
                  )}
                  <AppText
                    muted
                    style={[styles.metaText, isMissed && styles.missedText]}
                    numberOfLines={1}
                  >
                    {formatRelativeDateTime(call.startedAt)}
                    {isMissed
                      ? ""
                      : ` · ${formatDuration(call.durationSeconds)}`}
                  </AppText>
                </View>
              </View>

              <Pressable
                disabled={blocked}
                onPress={() => recall(contact.id, call.video === true)}
                accessibilityRole="button"
                accessibilityLabel={
                  call.video
                    ? t("calls.recallVideo", { name: contact.firstName })
                    : t("calls.recall", { name: contact.firstName })
                }
                style={({ pressed }) => [
                  styles.callButton,
                  pressed && styles.pressed,
                  blocked && styles.callButtonDisabled,
                ]}
              >
                {}
                <Feather
                  name={call.video ? "video" : "phone"}
                  size={18}
                  color={colors.textOnPrimary}
                />
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <AppText muted style={styles.empty}>
            {t("calls.empty")}
          </AppText>
        }
      />

      <Pressable
        onPress={() => router.push("/call/new")}
        accessibilityRole="button"
        accessibilityLabel={t("calls.newCall")}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <MaterialCommunityIcons
          name="phone-plus"
          size={26}
          color={colors.textOnPrimary}
        />
      </Pressable>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: spacing(2),
    marginLeft: spacing(5),
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: spacing(2),
    fontSize: 22,
  },
  list: {
    paddingTop: spacing(3),
    paddingHorizontal: spacing(5),
    paddingBottom: TAB_BAR_HEIGHT + spacing(16),
  },
  row: {
    marginBottom: spacing(2.5),
    padding: spacing(2.5),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  infos: {
    flex: 1,
    marginLeft: spacing(3),
  },
  meta: {
    marginTop: spacing(0.5),
    flexDirection: "row",
    alignItems: "center",
  },
  videoTag: {
    marginLeft: spacing(1),
  },
  metaText: {
    marginLeft: spacing(1),
    fontSize: 12,
  },
  missedText: {
    color: colors.danger,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  callButtonDisabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.75,
  },
  fab: {
    position: "absolute",
    right: spacing(5),
    bottom: TAB_BAR_HEIGHT + spacing(2),
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.85,
  },
  empty: {
    marginTop: spacing(8),
    textAlign: "center",
  },
});

export default CallsScreen;
