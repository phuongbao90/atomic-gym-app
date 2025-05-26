import { useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { TouchableOpacity } from "react-native";
import { TabBarProps, TabView } from "react-native-tab-view";
import { cn } from "../../utils/cn";
import { useState } from "react";

const routes = [
  { key: "workouts", title: "workouts" } as const,
  { key: "body", title: "body" } as const,
] as const;

export const StatisticTabScreen = () => {
  const { t } = useTranslation("common");
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  function renderTabBar(props: TabBarProps) {
    // const routes = props.navigationState?.routes;

    return (
      <View className="flex-row items-center justify-around py-4">
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            className="w-1/2 items-center justify-center"
            onPress={() => setIndex(i)}
          >
            <AppText
              className={cn("font-semibold text-xl", {
                "border-b-2 border-primary": i === props.navigationState.index,
              })}
            >
              {t(route.title)}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  function renderScene({ route }: { route: { key: string } }) {
    if (route.key === "workouts") {
      return null;
    }
    return null;
  }

  return (
    <AppScreen name="statistic-tab-screen">
      <AppText className="text-3xl font-semibold my-2 ml-4">
        {t("statistics")}
      </AppText>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </AppScreen>
  );
};
