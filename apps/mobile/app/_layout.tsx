import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "../global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { use$ } from "@legendapp/state/react";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { syncObservable } from "@legendapp/state/sync";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMMKVBoolean } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ReactQueryProvider } from "../src/lib/react-query";
import { storageKeyNames } from "../src/lib/storage/app-storage";
import { appStore$ } from "../src/stores/app-store";
import { authStore$ } from "../src/stores/auth-store";
import Onboarding from "./onboarding";
import "../src/configs/i18n";
import { createOfetchInstance } from "app";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";
import i18n from "../src/configs/i18n";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

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
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    i18n.changeLanguage(appStore$.language.get(), () => {
      createOfetchInstance({
        "Accept-Language": appStore$.language.get(),
      });
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
              {/* <StatusBar
                // backgroundColor={
                //   theme === "dark" ? primaryColors[300] : primaryColors[600]
                // }
                // translucent={theme === "dark"}
                translucent={true}
                animated
                // style="dark"
              /> */}
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
