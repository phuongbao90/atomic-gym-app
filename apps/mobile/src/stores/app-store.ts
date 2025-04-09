import { observable } from "@legendapp/state";
import { colorScheme } from "nativewind";

export const appStore$ = observable({
  theme: "light" as "light" | "dark",
  switchTheme: () => {
    const nextTheme = appStore$.theme.get() === "light" ? "dark" : "light";
    appStore$.theme.set(nextTheme);
    colorScheme.set(nextTheme);
  },
  language: "vi" as "vi" | "en",
  switchLanguage: () => {
    // const nextLanguage = appStore$.language.get() === "vi" ? "en" : "vi";
    // console.log("nextLanguage ", nextLanguage);
    // i18n.changeLanguage(nextLanguage).then(() => {
    //   // appStore$.language.set(nextLanguage as "vi" | "en");
    //   createOfetchInstance({
    //     "Accept-Language": nextLanguage,
    //   });
    // });
    // appStore$.language.set(nextLanguage as "vi" | "en");
    // i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi").then(() => {
    //   appStore$.language.set(i18n.language as "vi" | "en");
    //   createOfetchInstance({
    //     "Accept-Language": appStore$.language.get(),
    //   });
    // });
    // queryClient.clear();
    // console.log("runnnnnn");
  },
});
