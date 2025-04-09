import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { AppStorage } from "../lib/storage/app-storage";

import commonEn from "../locales/en/common.json";
import commonVi from "../locales/vi/common.json";
import homeScreenVi from "../locales/vi/home-screen.json";
import homeScreenEn from "../locales/en/home-screen.json";
import loginScreenEn from "../locales/en/login-screen.json";
import loginScreenVi from "../locales/vi/login-screen.json";
import settingsScreenEn from "../locales/en/settings-screen.json";
import settingsScreenVi from "../locales/vi/settings-screen.json";

const initI18n = async () => {
  let savedLanguage = AppStorage.getLanguage();

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode;
  }

  i18n.use(initReactI18next).init({
    ns: ["home-screen", "login-screen", "common", "settings-screen"],
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
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
