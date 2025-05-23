import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { AppText } from "../../components/ui/app-text";
import { Icon } from "../../components/ui/icon";
import { ItemContainer } from "../../components/ui/item-container";
import { ChevronRightIcon } from "../../components/ui/expo-icon";
import { useSession } from "../../lib/auth-client";
import { AppButton } from "../../components/ui/app-button";
import { useRouter } from "expo-router";
import { appRoutes } from "../../configs/routes";

export function SettingsScreen() {
  const { t } = useTranslation("settings-screen");
  const { t: tCommon } = useTranslation("common");
  const router = useRouter();

  const { data } = useSession();

  return (
    <AppScreen name="settings-screen">
      <AppHeader title={t("title")} withBackButton />
      <AppScrollView contentContainerClassName="px-4 pt-6">
        {!data?.session && (
          <ItemContainer className="mb-6">
            <View className="flex-row items-center">
              <Icon name={"user"} color="#15202b" containerClassName="w-12" />
              <View>
                <AppText className="ml-6 text-xl font-bold">
                  {t("guest")}
                </AppText>
                <AppText className="ml-6 text-base">
                  {t("sign-in-message")}
                </AppText>
              </View>
              <AppButton
                title={tCommon("sign_in")}
                onPress={() => {
                  router.navigate(appRoutes.login);
                }}
                containerClassName="ml-auto"
              />
            </View>
          </ItemContainer>
        )}
        <AppText className="text-2xl font-bold mb-6">
          {t("preferences")}
        </AppText>
        <ItemContainer className="gap-10">
          <View className="flex-row items-center">
            <Icon name={"ruler"} color="#5bbd37" containerClassName="w-12" />
            <AppText className="ml-6 text-lg font-bold">
              {t("units-of-measurement")}
            </AppText>
            <ChevRightIcon />
          </View>
          <View className="flex-row items-center">
            <Icon
              name={"adjust"}
              color="#ebad4d"
              size={24}
              containerClassName="w-12"
            />
            <AppText className="ml-6 text-lg font-bold">
              {t("appearance")}
            </AppText>
            <ChevRightIcon />
          </View>
          <View className="flex-row items-center">
            <Icon
              name={"plus-circle"}
              color="#e5917e"
              size={25}
              containerClassName="w-12"
            />
            <AppText className="ml-6 text-lg font-bold">
              {t("weight-increment")}
            </AppText>
            <ChevRightIcon />
          </View>
          <View className="flex-row items-center">
            <Icon
              name={"clipboard-list"}
              color="#698a53"
              size={25}
              containerClassName="w-12"
            />
            <AppText className="ml-6 text-lg font-bold">
              {t("default-sets")}
            </AppText>
            <ChevRightIcon />
          </View>
          <View className="flex-row items-center">
            <Icon
              name={"clock"}
              color="#8e87ea"
              size={25}
              containerClassName="w-12"
            />
            <AppText className="ml-6 text-lg font-bold">
              {t("default-rest-time")}
            </AppText>
            <ChevRightIcon />
          </View>
        </ItemContainer>
      </AppScrollView>
    </AppScreen>
  );
}

const ChevRightIcon = () => {
  return <ChevronRightIcon className="ml-auto" />;
};
