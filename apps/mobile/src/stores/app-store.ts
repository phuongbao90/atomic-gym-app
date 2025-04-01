import { observable } from "@legendapp/state"
import { colorScheme } from "nativewind"
import i18n from "../configs/i18n"

export const appStore$ = observable({
  theme: "light" as "light" | "dark",
  switchTheme: () => {
    const nextTheme = appStore$.theme.get() === "light" ? "dark" : "light"
    appStore$.theme.set(nextTheme)
    colorScheme.set(nextTheme)
  },
  language: "vi",
  switchLanguage: () => {
    const nextLanguage = appStore$.language.get() === "vi" ? "en" : "vi"
    appStore$.language.set(nextLanguage)
    i18n.changeLanguage(nextLanguage)
  },
})
