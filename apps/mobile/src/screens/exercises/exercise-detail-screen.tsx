import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { TabView } from "react-native-tab-view";
import { ExerciseSummary } from "./components/exercise-summary";
import { ExerciseHistoryLogs } from "./components/exercise-history-logs";
import { useGetExercise } from "app";
import { AppText } from "../../components/ui/app-text";
import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";

const routes = [
  { key: "summary", title: "summary" } as const,
  { key: "history", title: "history" } as const,
] as const;

type TabBarProps = {
  layout: {
    width: number;
    height: number;
  };
  navigationState: {
    index: number;
    routes: {
      key: string;
      title: string;
    }[];
  };
};

export const ExerciseDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const { data: exercise } = useGetExercise(id);
  // console.log(
  //   "🚀 ~ ExerciseDetailScreen ~ exercise:",
  //   JSON.stringify(exercise, null, 2)
  // );

  function renderTabBar(props: TabBarProps) {
    const routes = props.navigationState?.routes;

    return (
      <View className="flex-row items-center justify-around py-4 bg-slate-400 dark:bg-slate-600">
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
    if (!exercise) return null;
    if (route.key === "summary") {
      return <ExerciseSummary exercise={exercise} />;
    }
    return <ExerciseHistoryLogs exercise={exercise} />;
  }

  return (
    <AppScreen name="exercise-detail-screen">
      <AppHeader withBackButton withBottomBorder={false} />
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
