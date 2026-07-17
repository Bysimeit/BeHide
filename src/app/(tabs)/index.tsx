import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../components/ui/Screen";
import { AppText } from "../../components/ui/AppText";
import { WelcomeHeader } from "../../components/home/WelcomeHeader";
import { ConversationItem } from "../../components/home/ConversationItem";
import { colors, spacing, TAB_BAR_HEIGHT } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import { useAppData } from "../../data/store";
import { useAuth } from "../../auth/AuthContext";

const ConversationsScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const { identity } = useAuth();
  const { conversations } = useAppData();

  return (
    <Screen>
      <WelcomeHeader firstName={identity?.pseudo ?? ""} />

      <View style={styles.sectionHeader}>
        <Ionicons name="chatbox-outline" size={26} color={colors.text} />
        <AppText weight="semiBold" style={styles.sectionTitle}>
          {t("home.conversations")}
        </AppText>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => router.push(`/chat/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <AppText muted style={styles.empty}>
            {t("home.empty")}
          </AppText>
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: spacing(4),
    marginLeft: spacing(5),
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    marginLeft: spacing(2),
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing(5),
    paddingBottom: TAB_BAR_HEIGHT + spacing(4),
  },
  empty: {
    marginTop: spacing(8),
    textAlign: "center",
  },
});

export default ConversationsScreen;
