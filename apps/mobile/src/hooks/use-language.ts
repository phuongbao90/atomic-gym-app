import { useQueryClient } from "@tanstack/react-query";
import i18n from "../configs/i18n";
import { appStore$ } from "../stores/app-store";
import { createOfetchInstance } from "app";

export const useLanguage = () => {
  const queryClient = useQueryClient();

  const switchLanguage = (language: "vi" | "en") => {
    i18n.changeLanguage(language === "vi" ? "en" : "vi", () => {
      appStore$.language.set(language === "vi" ? "en" : "vi");
      createOfetchInstance({
        "Accept-Language": language === "vi" ? "en" : "vi",
      });
      queryClient.clear();
    });
  };

  return { switchLanguage };
};
