import { Tabs } from "expo-router/js-tabs";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { FloatingTabBar } from "../../components/navigation/FloatingTabBar";
import { useTranslate } from "../../i18n";

const TabsLayout = () => {
  const t = useTranslate();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.conversations"),
          tabBarAccessibilityLabel: t("tabs.conversations"),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: t("tabs.calls"),
          tabBarAccessibilityLabel: t("tabs.calls"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="phone" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: t("tabs.contacts"),
          tabBarAccessibilityLabel: t("tabs.contacts"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="contacts" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarAccessibilityLabel: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
