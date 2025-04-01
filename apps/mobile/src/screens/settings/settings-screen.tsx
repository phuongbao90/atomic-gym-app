import { View } from "react-native"
import { AppHeader } from "../../components/ui/app-header"
import { AppScreen } from "../../components/ui/app-screen"
import { AppScrollView } from "../../components/ui/app-scrollview"
import { AppText } from "../../components/ui/app-text"
import { Icon } from "../../components/ui/icon"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { appStore$ } from "../../stores/app-store"
import { use$ } from "@legendapp/state/react"
import { ItemContainer } from "../../components/ui/item-container"
import { useTranslation } from "react-i18next"

export function SettingsScreen() {
  const { t } = useTranslation("settings-screen")
  return (
    <AppScreen name="settings-screen">
      <AppHeader title={t("title")} withBackButton />
      <AppScrollView contentContainerClassName="px-4 pt-6">
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
  )
}

const ChevRightIcon = () => {
  const theme = use$(appStore$.theme)

  return (
    <FontAwesome5
      name="chevron-right"
      size={16}
      color={theme === "light" ? "black" : "white"}
      className="ml-auto"
    />
  )
}
