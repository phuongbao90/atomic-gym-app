import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "../global.css";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useNavigationContainerRef } from "expo-router";
import { useEffect, useRef } from "react";
import { StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMMKVBoolean } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ReactQueryProvider } from "../src/lib/react-query";
import Onboarding from "./onboarding";
import "../src/configs/i18n";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";
import { ModalProvider } from "react-native-modalfy";
import { modalStack } from "../src/lib/modal/modal-stack";
import { Provider } from "react-redux";
import { persistor, store, useAppSelector } from "../src/stores/redux-store";
import i18n from "../src/configs/i18n";
import { PersistGate } from "redux-persist/integration/react";
import { colorScheme } from "nativewind";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import notifee from "@notifee/react-native";
import restTimeEndSound from "../assets/sounds/rest-time-end.mp3";
import { enableScreens } from "react-native-screens";
import { getCookie, useSession } from "../src/lib/auth-client";
import {
  AppStorage,
  clearRequestCookie,
  setRequestCookie,
  setRequestLanguage,
  storageKeyNames,
} from "app";
import { useNetInfo } from "@react-native-community/netinfo";
import { setIsConnected } from "../src/stores/slices/app-slice";
import { AudioModule } from "expo-audio";

enableScreens();

notifee.registerForegroundService(async (task) => {
  // if (task.id === "activate-workout-session") {
  // }
  if (task.id === "rest-time" && task.data?.restTime) {
    setTimeout(async () => {
      await notifee.stopForegroundService();

      // await Audio.Sound.createAsync(restTimeEndSound, { shouldPlay: true });
      await AudioModule.playRecordingAsync(restTimeEndSound);
    }, Number(task.data?.restTime) * 1000);
  }
});

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

  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);

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
                  <ActionSheetProvider>
                    <PortalProvider>
                      <StatusBar
                        translucent
                        backgroundColor="black"
                        networkActivityIndicatorVisible
                      />
                      <View
                        style={{
                          flex: 1,
                          paddingBottom: insets.bottom,
                          paddingTop: insets.top,
                        }}
                      >
                        <App />
                        <Toaster
                          position="top-center"
                          duration={2000}
                          style={{ marginTop: 10 }}
                        />
                      </View>
                    </PortalProvider>
                  </ActionSheetProvider>
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
  const { isConnected } = useNetInfo();
  const [isOnboarded, setIsOnboarded] = useMMKVBoolean(
    storageKeyNames.isOnboarded
  );
  const { data } = useSession();
  const language = useAppSelector((state) => state.app.language);
  const theme = useAppSelector((state) => state.app.theme);
  const runOnce = useRef(false);
  const runOnceTheme = useRef(false);
  const cookie = getCookie();

  useEffect(() => {
    if (cookie) {
      setRequestCookie(cookie);
      AppStorage.setCookie(cookie);
    } else {
      clearRequestCookie();
      AppStorage.setCookie("");
    }
  }, [cookie]);

  useEffect(() => {
    if (isConnected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;
    i18n.changeLanguage(language, () => {
      setRequestLanguage(language);
    });
  }, [language]);

  useEffect(() => {
    if (runOnceTheme.current) return;
    runOnceTheme.current = true;
    colorScheme.set(theme);
  }, [theme]);

  if (!isOnboarded) {
    return <Onboarding setIsOnboarded={setIsOnboarded} />;
  }

  if (!data?.session) {
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
