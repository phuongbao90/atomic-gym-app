import { observable } from "@legendapp/state";
import { colorScheme } from "nativewind";

export const appStore$ = observable({
  theme: "light",
  switchTheme: () => {
    const nextTheme = appStore$.theme.get() === "light" ? "dark" : "light";
    appStore$.theme.set(nextTheme);
    colorScheme.set(nextTheme);
  },
});
