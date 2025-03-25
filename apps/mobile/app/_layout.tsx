import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "../global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { use$ } from "@legendapp/state/react";
import { setAccessToken } from "app";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMMKVBoolean } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ReactQueryProvider } from "../src/lib/react-query";
import { storageKeyNames } from "../src/lib/storage/app-storage";
import { authStore$ } from "../src/stores/auth-store";
import Onboarding from "./onboarding";
import { SafeAreaView, View } from "react-native";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { appStore$ } from "../src/stores/app-store";
import { primaryColors } from "app-config";

syncObservable(appStore$, {
  persist: {
    name: "appStore",
    plugin: ObservablePersistMMKV,
  },
});
syncObservable(authStore$, {
  persist: {
    name: "authStore",
    plugin: ObservablePersistMMKV,
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const theme = use$(appStore$.theme);
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <PortalProvider>
              <StatusBar
                backgroundColor={
                  theme === "dark" ? primaryColors[300] : primaryColors[600]
                }
                translucent={theme === "dark"}
                animated
                style="dark"
              />
              <SafeAreaView className="flex-1" style={{ top: insets.top }}>
                <App />
                <Toaster position="bottom-center" duration={3000} />
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
