import { observable } from "@legendapp/state";
import { colorScheme } from "nativewind";
import i18n from "../configs/i18n";

export const appStore$ = observable({
  theme: "light" as "light" | "dark",
  switchTheme: () => {
    const nextTheme = appStore$.theme.get() === "light" ? "dark" : "light";
    appStore$.theme.set(nextTheme);
    colorScheme.set(nextTheme);
  },
  language: "vi" as "vi" | "en",
  switchLanguage: () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi").then(() => {
      appStore$.language.set(i18n.language as "vi" | "en");
    });
  },
});
