import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import commonEn from "../locales/en/common.json";
import commonVi from "../locales/vi/common.json";
import homeScreenVi from "../locales/vi/home-screen.json";
import homeScreenEn from "../locales/en/home-screen.json";
import loginScreenEn from "../locales/en/login-screen.json";
import loginScreenVi from "../locales/vi/login-screen.json";
import settingsScreenEn from "../locales/en/settings-screen.json";
import settingsScreenVi from "../locales/vi/settings-screen.json";
import i18n from "i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ModalProvider } from "react-native-modalfy";
import { modalStack } from "../lib/modal/modal-stack";
import { store } from "../stores/redux-store";
import { Provider } from "react-redux";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

i18n.use(initReactI18next).init({
  lng: "vi", // Set default language for tests to match the mockData
  fallbackLng: "vi",
  ns: ["common", "workout-plans"],
  defaultNS: "common",
  resources: {
    en: {
      "home-screen": homeScreenEn,
      "login-screen": loginScreenEn,
      common: commonEn,
      "settings-screen": settingsScreenEn,
    },
    vi: {
      "home-screen": homeScreenVi,
      "login-screen": loginScreenVi,
      common: commonVi,
      "settings-screen": settingsScreenVi,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export const DefaultMockWrapper = ({
  children,
}: { children: React.ReactNode }) => {
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       retry: false, // don't retry failing queries during tests
  //     },
  //   },
  // });

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ModalProvider stack={modalStack}>
                  <BottomSheetModalProvider>
                    <ActionSheetProvider>
                      <PortalProvider>{children}</PortalProvider>
                    </ActionSheetProvider>
                  </BottomSheetModalProvider>
                </ModalProvider>
              </GestureHandlerRootView>
            </KeyboardProvider>
          </QueryClientProvider>
        </Provider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};
