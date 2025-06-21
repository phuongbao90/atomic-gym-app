import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "../global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { useFonts } from "expo-font";
import {
  router,
  SplashScreen,
  Stack,
  useNavigationContainerRef,
} from "expo-router";
import { useEffect, useRef } from "react";
import { Platform, StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMMKVBoolean } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ReactQueryProvider } from "../src/lib/react-query";
import Onboarding from "./onboarding";
import "../src/configs/i18n";
import "../src/lib/calendar-locales";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";
import { ModalProvider } from "react-native-modalfy";
import { modalStack } from "../src/lib/modal/modal-stack";
import { Provider } from "react-redux";
import {
  persistor,
  store,
  useAppDispatch,
  useAppSelector,
} from "../src/stores/redux-store";
import i18n from "../src/configs/i18n";
import { PersistGate } from "redux-persist/integration/react";
import { colorScheme } from "nativewind";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import notifee, { Notification } from "@notifee/react-native";
import restTimeEndSound from "../assets/sounds/rest-time-end.mp3";
import { enableScreens } from "react-native-screens";
import { getCookie, useSession } from "../src/lib/auth-client";
import {
  appStorage,
  AppStorage,
  clearRequestCookie,
  queryClient,
  setRequestCookie,
  setRequestLanguage,
  storageKeyNames,
} from "app";
import { useNetInfo } from "@react-native-community/netinfo";
import { setIsConnected } from "../src/stores/slices/app-slice";
import { AudioModule } from "expo-audio";
import { useSyncQueriesExternal } from "react-query-external-sync";
import Constants from "expo-constants";
import {
  displayNotification,
  getFCMToken,
  useNotificationSetup,
} from "../src/services/notification-service";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";

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

const hostIP =
  Constants.expoGoConfig?.debuggerHost?.split(":")[0] ||
  Constants.expoConfig?.hostUri?.split(":")[0];

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

messaging().setBackgroundMessageHandler(
  async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.debug("[RootLayout] Background message received!", remoteMessage);
    // This will display the notification in the system tray when the app is in the background or killed.
    await displayNotification(remoteMessage);
  }
);

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

  useSyncQueriesExternal({
    queryClient: queryClient,
    socketURL: `http://${hostIP}:42831`, // Use local network IP
    deviceName: Platform?.OS || "web", // Platform detection
    platform: Platform?.OS || "web", // Use appropriate platform identifier
    deviceId: Platform?.OS || "web", // Use a PERSISTENT identifier (see note below)
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: "1.0.0",
      // Add any relevant platform info
    },
    enableLogs: false,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
      // Add any private environment variables you want to monitor
      // Public environment variables are automatically loaded
    },
    // Storage monitoring with CRUD operations
    mmkvStorage: appStorage, // MMKV storage for ['#storage', 'mmkv', 'key'] queries + monitoring
    // asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
    // secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
    // secureStorageKeys: [
    //   "userToken",
    //   "refreshToken",
    //   "biometricKey",
    //   "deviceId",
    // ], // SecureStore keys to monitor
  });

  const handleNotificationPress = (notification?: Notification) => {
    if (notification?.data) {
      console.debug(
        "[RootLayout] Handling notification press:",
        notification.data
      );
      const { screenUrl } = notification.data;

      if (typeof screenUrl === "string") {
        //@ts-ignore
        router.navigate(screenUrl);
      }
    }
  };

  useNotificationSetup(handleNotificationPress);

  // --- Register FCM Token with Your Server (Example) ---
  useEffect(() => {
    const registerDevice = async () => {
      const token = await getFCMToken();
      if (token) {
        // Here you would send the token to your backend API
        // e.g., await myApi.registerDeviceToken(token);
        console.debug(
          "[RootLayout] Device token sent to server (simulated):",
          token
        );
      }
    };

    // Listen for token refreshes from FCM and re-register
    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh((newToken) => {
      console.debug("[RootLayout] Token refreshed. Re-registering...");
      // await myApi.registerDeviceToken(newToken);
    });

    registerDevice();

    return () => {
      unsubscribeOnTokenRefresh();
    };
  }, []);

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
  const dispatch = useAppDispatch();

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
      dispatch(setIsConnected(true));
    } else {
      dispatch(setIsConnected(false));
    }
  }, [isConnected, dispatch]);

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
    <Stack
      screenOptions={{
        headerShown: false,
        // animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="(app)/workout-session/edit-session-date"
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
};
