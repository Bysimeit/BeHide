import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { PublicKeyQrModal } from "../../components/ui/PublicKeyQrModal";
import {
  colors,
  fonts,
  radius,
  spacing,
  TAB_BAR_HEIGHT,
} from "../../constants/theme";
import { useI18n } from "../../i18n";
import { displayName, useAppData } from "../../data/store";
import { useAuth } from "../../auth/AuthContext";

const ContactsScreen = () => {
  const router = useRouter();
  const { t, language } = useI18n();
  const { contacts } = useAppData();
  const { identity } = useAuth();
  const [query, setQuery] = useState("");
  const [qrVisible, setQrVisible] = useState(false);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const sorted = [...contacts].sort((a, b) =>
      displayName(a).localeCompare(displayName(b), language, {
        sensitivity: "base",
      }),
    );
    if (!needle) return sorted;
    return sorted.filter((c) =>
      displayName(c).toLowerCase().includes(needle),
    );
  }, [contacts, query, language]);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <MaterialCommunityIcons
            name="contacts"
            size={24}
            color={colors.text}
          />
          <AppText weight="semiBold" style={styles.title}>
            {t("contacts.title")}
          </AppText>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setQrVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t("contacts.showQr")}
            style={({ pressed }) => [
              styles.qrButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="qr-code-outline"
              size={22}
              color={colors.primary}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push("/contact/new")}
            accessibilityRole="button"
            accessibilityLabel={t("contacts.add")}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather name="plus" size={24} color={colors.textOnPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("contacts.search")}
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          accessibilityLabel={t("contacts.search")}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const blockedByThem = item.blockedAt !== null;
          const blockedByMe = item.blockedByMeAt !== null;
          const subtitle = blockedByThem
            ? t("contacts.blockedByThem")
            : blockedByMe
              ? t("contacts.blockedByMe")
              : item.fingerprint;

          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/contact/[id]",
                  params: { id: item.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={t("contacts.open", { name: displayName(item) })}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.pressed,
                (blockedByThem || blockedByMe) && styles.rowBlocked,
              ]}
            >
              <Avatar
                size={48}
                firstName={item.firstName}
                lastName={item.lastName}
              />
              <View style={styles.infos}>
                <AppText weight="semiBold" numberOfLines={1}>
                  {displayName(item)}
                </AppText>
                <AppText muted style={styles.fingerprint} numberOfLines={1}>
                  {subtitle}
                </AppText>
              </View>
              <Feather
                name="chevron-right"
                size={22}
                color={colors.textMuted}
              />
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <AppText muted style={styles.empty}>
            {query
              ? t("contacts.emptySearch", { query })
              : t("contacts.empty")}
          </AppText>
        }
      />

      <PublicKeyQrModal
        visible={qrVisible}
        publicKey={identity?.publicKey ?? ""}
        exchangePublicKey={identity?.exchangePublicKey ?? ""}
        onClose={() => setQrVisible(false)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: spacing(2),
    paddingHorizontal: spacing(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: spacing(2),
    fontSize: 22,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing(2),
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    marginTop: spacing(4),
    marginHorizontal: spacing(5),
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
    paddingHorizontal: spacing(5),
    paddingBottom: TAB_BAR_HEIGHT + spacing(4),
  },
  row: {
    marginBottom: spacing(2.5),
    padding: spacing(2.5),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  rowBlocked: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.8,
  },
  infos: {
    flex: 1,
    marginLeft: spacing(3),
  },
  fingerprint: {
    fontSize: 12,
  },
  empty: {
    marginTop: spacing(8),
    textAlign: "center",
  },
});

export default ContactsScreen;
