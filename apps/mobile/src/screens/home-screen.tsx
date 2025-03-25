import { useTranslation } from "react-i18next";
import { AppScreen } from "../components/ui/app-screen";
import { Text } from "react-native";

export function HomeScreen() {
  const { t } = useTranslation();

  return (
    <AppScreen>
      <Text>{t("title")}</Text>
    </AppScreen>
  );
}
