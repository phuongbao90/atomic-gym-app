import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "../global.css";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMMKVBoolean } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ReactQueryProvider } from "../src/lib/react-query";
import { storageKeyNames } from "../src/lib/storage/app-storage";
import Onboarding from "./onboarding";
import "../src/configs/i18n";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";
import { ModalProvider } from "react-native-modalfy";
import { modalStack } from "../src/lib/modal/modal-stack";
import { DevFloatingButtons } from "../src/components/dev-floating-buttons";
import { Provider } from "react-redux";
import { persistor, store, useAppSelector } from "../src/stores/redux-store";
import i18n from "../src/configs/i18n";
import { createOfetchInstance } from "app";
import { PersistGate } from "redux-persist/integration/react";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReactQueryProvider>
          <KeyboardProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ModalProvider stack={modalStack}>
                <BottomSheetModalProvider>
                  <PortalProvider>
                    <ActionSheetProvider>
                      <SafeAreaView
                        className="flex-1"
                        style={{ top: insets.top }}
                      >
                        <App />
                        <Toaster position="top-center" duration={2000} />
                        {__DEV__ && <DevFloatingButtons />}
                      </SafeAreaView>
                    </ActionSheetProvider>
                  </PortalProvider>
                </BottomSheetModalProvider>
              </ModalProvider>
            </GestureHandlerRootView>
          </KeyboardProvider>
        </ReactQueryProvider>
      </PersistGate>
    </Provider>
  );
}

const App = () => {
  const [isOnboarded] = useMMKVBoolean(storageKeyNames.isOnboarded);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const language = useAppSelector((state) => state.app.language);
  const runOnce = useRef(false);

  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;
    i18n.changeLanguage(language, () => {
      createOfetchInstance({
        "Accept-Language": language,
      });
    });
  }, [language]);

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
