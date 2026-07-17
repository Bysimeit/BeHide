import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { colors, fonts, radius, spacing } from "../../constants/theme";
import { useI18n, type Translate } from "../../i18n";
import { displayName, useAppData } from "../../data/store";
import { useCall } from "../../call/CallContext";
import { isCallSupported } from "../../p2p/webrtc";

const callableState = (
  blockedByThem: boolean,
  blockedByMe: boolean,
  t: Translate,
) =>
  blockedByThem
    ? { callable: false, reason: t("contacts.blockedByThem") }
    : blockedByMe
      ? { callable: false, reason: t("contacts.blockedByMe") }
      : { callable: true, reason: null as string | null };

const NewCallScreen = () => {
  const router = useRouter();
  const { t, language } = useI18n();
  const { contacts } = useAppData();
  const { startCall } = useCall();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const sorted = [...contacts].sort((a, b) =>
      displayName(a).localeCompare(displayName(b), language, {
        sensitivity: "base",
      }),
    );
    if (!needle) return sorted;
    return sorted.filter((c) => displayName(c).toLowerCase().includes(needle));
  }, [contacts, query, language]);

  const launchCall = (contactId: string, video: boolean) => {
    if (!isCallSupported) {
      Alert.alert(t("calls.unavailableTitle"), t("calls.unavailableMessage"));
      return;
    }
    if (!startCall(contactId, video)) return;
    router.replace({ pathname: "/call/[id]", params: { id: contactId } });
  };

  return (
    <Screen style={styles.screen}>
      <ScreenHeader title={t("call.newTitle")} onBack={() => router.back()} />

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("call.search")}
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          accessibilityLabel={t("call.searchLabel")}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const { callable, reason } = callableState(
            item.blockedAt !== null,
            item.blockedByMeAt !== null,
            t,
          );

          return (
            <View style={[styles.row, !callable && styles.rowDisabled]}>
              <Avatar
                size={48}
                firstName={item.firstName}
                lastName={item.lastName}
              />
              <View style={styles.infos}>
                <AppText weight="semiBold" numberOfLines={1}>
                  {displayName(item)}
                </AppText>
                <AppText muted style={styles.subtitle} numberOfLines={1}>
                  {reason ?? item.fingerprint}
                </AppText>
              </View>
              {callable && (
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => launchCall(item.id, false)}
                    accessibilityRole="button"
                    accessibilityLabel={t("call.startCall", {
                      name: displayName(item),
                    })}
                    style={({ pressed }) => [
                      styles.audioBadge,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Feather
                      name="phone"
                      size={16}
                      color={colors.textOnPrimary}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => launchCall(item.id, true)}
                    accessibilityRole="button"
                    accessibilityLabel={t("call.startVideoCall", {
                      name: displayName(item),
                    })}
                    style={({ pressed }) => [
                      styles.videoBadge,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Feather
                      name="video"
                      size={16}
                      color={colors.textOnPrimary}
                    />
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <AppText muted style={styles.empty}>
            {query ? t("call.emptySearch", { query }) : t("call.empty")}
          </AppText>
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing(5),
  },
  searchRow: {
    marginTop: spacing(2),
    paddingHorizontal: spacing(4),
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing(2),
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  list: {
    paddingTop: spacing(3),
    paddingBottom: spacing(8),
  },
  row: {
    marginBottom: spacing(2.5),
    padding: spacing(2.5),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  rowDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  infos: {
    flex: 1,
    marginLeft: spacing(3),
  },
  subtitle: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  audioBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  videoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: spacing(2),
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    marginTop: spacing(8),
    textAlign: "center",
  },
});

export default NewCallScreen;
