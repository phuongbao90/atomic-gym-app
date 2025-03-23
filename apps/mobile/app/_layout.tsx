import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "../global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { use$ } from "@legendapp/state/react";
import { setAccessToken } from "@repo/app";
import { appColors } from "@repo/app-config";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMMKVBoolean } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ReactQueryProvider } from "../lib/react-query";
import { storageKeyNames } from "../lib/storage/app-storage";
import { authStore$ } from "../stores/auth-store";
import Onboarding from "./onboarding";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then((token) => {
      // console.log("setting access token", token);
      if (token) {
        setAccessToken(token);
      }
    });
  }, []);

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
                backgroundColor={
                  theme.colorScheme === "dark"
                    ? appColors.dark.primary
                    : appColors.light.primary
                }
                translucent={theme.colorScheme === "dark"}
                animated
                style="dark"
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
  const isLoggedIn = use$(authStore$.isLoggedIn);

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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};
