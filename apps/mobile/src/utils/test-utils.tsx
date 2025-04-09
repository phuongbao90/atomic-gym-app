import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

import commonEn from "../locales/en/common.json";
import commonVi from "../locales/vi/common.json";
import homeScreenVi from "../locales/vi/home-screen.json";
import homeScreenEn from "../locales/en/home-screen.json";
import loginScreenEn from "../locales/en/login-screen.json";
import loginScreenVi from "../locales/vi/login-screen.json";
import settingsScreenEn from "../locales/en/settings-screen.json";
import settingsScreenVi from "../locales/vi/settings-screen.json";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// Initialize i18n for testing
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const DefaultWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export const customRender = (
  ui: React.ReactElement,
  wrapper: React.ComponentType<any> | undefined = DefaultWrapper
) => {
  return render(ui, { wrapper });
};

export const customRenderHook = (
  hook: () => any,
  wrapper: React.ComponentType<any> | undefined = DefaultWrapper
) => {
  return renderHook(hook, { wrapper });
};
