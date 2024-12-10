import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { appColors } from "@repo/app-config";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMMKVBoolean } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ReactQueryProvider } from "../lib/react-query";
import { storageKeyNames } from "../lib/storage/app-storage";
import { useAuthStore } from "../stores/use-auth-store";
import Onboarding from "./onboarding";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ReactQueryProvider>
      <KeyboardProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <PortalProvider>
              <StatusBar
                backgroundColor={appColors.dark.primary}
                translucent
                animated
              />
              <Toaster position="bottom-center" duration={3000} />
              <SafeAreaView style={{ flex: 1 }}>
                <App />
              </SafeAreaView>
            </PortalProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </ReactQueryProvider>
  );
}

const App = () => {
  const [isOnboarded] = useMMKVBoolean(storageKeyNames.isOnboarded);
  const { isLoggedIn } = useAuthStore();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  if (!isLoggedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};
