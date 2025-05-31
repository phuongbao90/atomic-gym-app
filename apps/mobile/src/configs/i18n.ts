import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "../locales/en/common.json";
import commonVi from "../locales/vi/common.json";
import homeScreenVi from "../locales/vi/home-screen.json";
import homeScreenEn from "../locales/en/home-screen.json";
import settingsScreenEn from "../locales/en/settings-screen.json";
import settingsScreenVi from "../locales/vi/settings-screen.json";
import authScreenEn from "../locales/en/auth.json";
import authScreenVi from "../locales/vi/auth.json";
import { ZodErrorMap } from "zod";
import z from "zod";
import { AppStorage } from "app";

const customErrorMap: ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case "too_small":
      if (!!issue.minimum && issue.type === "string") {
        return {
          message: i18n.t("errors.stringMin", {
            count: issue.minimum as number,
            field: issue.path.join("."),
          }),
        };
      }
      break;
    // Add other cases if needed
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

const initI18n = async () => {
  let savedLanguage = AppStorage.getLanguage();

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode;
  }

  i18n.use(initReactI18next).init({
    ns: ["home-screen", "auth", "common", "settings-screen"],
    defaultNS: "common",
    resources: {
      en: {
        "home-screen": homeScreenEn,
        auth: authScreenEn,
        common: commonEn,
        "settings-screen": settingsScreenEn,
      },
      vi: {
        "home-screen": homeScreenVi,
        auth: authScreenVi,
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
