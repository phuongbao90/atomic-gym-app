import { useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { TouchableOpacity } from "react-native";
import { TabView } from "react-native-tab-view";
import { cn } from "../../utils/cn";
import { useCallback, useEffect } from "react";
import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { StatisticTabWorkouts } from "./components/statistic-tab.workouts";
import { StatisticTabBody } from "./components/statisic-tab.body";

const index$ = observable(0);

const routes = [
  { key: "workouts", title: "workouts" } as const,
  { key: "body", title: "body" } as const,
] as const;

const TabBar = () => {
  const { t } = useTranslation("common");
  const index = use$(() => index$.get());
  const routes = [
    { key: "workouts", title: "workouts" } as const,
    { key: "body", title: "body" } as const,
  ] as const;
  return (
    <View className="flex-row items-center justify-around py-4">
      {routes.map((route, i) => (
        <TouchableOpacity
          key={route.key}
          className="w-1/2 items-center justify-center"
          onPress={() => index$.set(i)}
        >
          <AppText
            className={cn("font-semibold text-xl", {
              "border-b-2 border-primary": i === index,
            })}
          >
            {t(route.title)}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FirstRoute = () => {
  return <StatisticTabWorkouts />;
};
const SecondRoute = () => {
  return <StatisticTabBody />;
};

export const StatisticTabScreen = () => {
  const { t } = useTranslation("common");
  const index = use$(() => index$.get());

  const layout = useWindowDimensions();
  const renderTabBar = useCallback(() => {
    return <TabBar />;
  }, []);

  useEffect(() => {
    return () => {
      index$.set(0);
    };
  }, []);

  const renderScene = useCallback(({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "workouts":
        return <FirstRoute />;

      case "body":
        return <SecondRoute />;

      default:
        return null;
    }
  }, []);

  return (
    <AppScreen name="statistic-tab-screen">
      <AppText className="text-3xl font-semibold mt-4 mb-2 ml-4">
        {t("statistics")}
      </AppText>
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(i: number) => index$.set(i)}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        scrollEnabled
      />
    </AppScreen>
  );
};
