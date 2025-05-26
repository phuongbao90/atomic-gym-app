import { useTranslation } from "react-i18next";
import { AppText } from "./ui/app-text";
import { useNetInfo } from "@react-native-community/netinfo";
import { View } from "react-native";

export const RequireInternetContainer = ({
  children,
}: { children: React.ReactNode }) => {
  const { t } = useTranslation("common");
  const { isConnected } = useNetInfo();

  if (!isConnected) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText className="text-center">{t("enable_internet")}</AppText>
      </View>
    );
  }

  return children;
};
