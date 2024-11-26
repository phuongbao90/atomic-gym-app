import "react-native-get-random-values";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "../styles/unistyles";

import { ReactQueryProvider } from "@/lib/react-query";
import { storageKeyNames } from "@/lib/storage/app-storage";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { appColors } from "@repo/app-config/app-colors";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useMMKVBoolean } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnistylesProvider } from "react-native-unistyles";
import { Toaster } from "sonner-native";
import Onboarding from "./onboarding";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isOnboarded] = useMMKVBoolean(storageKeyNames.isOnboarded);

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
      <UnistylesProvider>
        <KeyboardProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <PortalProvider>
                <StatusBar
                  backgroundColor={appColors.dark.primary}
                  translucent
                  animated
                />
                <Toaster
                  position="bottom-center"
                  duration={3000}
                  // offset={keyboardShown ? keyboardHeight + 10 : 0}
                />
                <SafeAreaView style={{ flex: 1 }}>
                  {isOnboarded ? <App /> : <Onboarding />}
                </SafeAreaView>
              </PortalProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </KeyboardProvider>
      </UnistylesProvider>
    </ReactQueryProvider>
  );
}

const App = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
};
