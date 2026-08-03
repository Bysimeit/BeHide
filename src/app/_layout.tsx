import { useEffect } from "react";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors, fontAssets } from "../constants/theme";
import { I18nProvider, useI18n } from "../i18n";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import { AppDataProvider } from "../data/store";
import { CallProvider } from "../call/CallContext";
import { NotificationGateway } from "../notifications/NotificationGateway";

SplashScreen.preventAutoHideAsync();

const RootNavigator = ({ fontsReady }: { fontsReady: boolean }) => {
  const { status } = useAuth();
  const { ready: languageReady } = useI18n();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const navigatorReady = navigationState?.key != null;

  const ready = fontsReady && languageReady && status !== "loading";

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    if (!ready || !navigatorReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (status === "unlocked") {
      const onRecovery = segments[1] === "recovery";
      if (inAuthGroup && !onRecovery) router.replace("/");
      return;
    }

    if (!inAuthGroup) {
      router.replace("/login");
    }
  }, [ready, navigatorReady, status, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen
        name="media/[id]"
        options={{ animation: "fade", contentStyle: { backgroundColor: colors.text } }}
      />
      <Stack.Screen name="contact/new" />
      <Stack.Screen name="contact/[id]" />
      <Stack.Screen name="call/new" />
      <Stack.Screen name="call/[id]" />
      <Stack.Screen name="private-key" />
    </Stack>
  );
};

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <AuthProvider>
            <AppDataProvider>
              <CallProvider>
                <StatusBar style="dark" />
                <NotificationGateway />
                <RootNavigator fontsReady={fontsLoaded || !!fontError} />
              </CallProvider>
            </AppDataProvider>
          </AuthProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
