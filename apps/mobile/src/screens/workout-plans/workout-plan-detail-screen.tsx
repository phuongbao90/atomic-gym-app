import { use$ } from "@legendapp/state/react";
import { useGetWorkoutPlan } from "app";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view";
import { AppButton } from "../../components/ui/app-button";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { appStore$ } from "../../stores/app-store";
import { cn } from "../../utils/cn";
import { PlanInfo } from "./components/workout-plan-info";
import { WorkoutPlanStatistics } from "./components/workout-plan-statistics";
import { useTranslation } from "react-i18next";

const routes = [
  { key: "first", title: "overview" },
  { key: "second", title: "statistics" },
];

const TabBar = (props: TabBarProps<string>) => {
  const { index, tabNames } = props || {};
  const { t } = useTranslation();

  return (
    <View className="flex-row justify-around">
      {tabNames.map((route, i) => (
        <Pressable
          key={route}
          onPress={() => props.onTabPress?.(route)}
          className="w-1/2"
        >
          <View
            className={cn({
              "items-center h-12 justify-center": true,
              "border-b-2 border-primary": index.get() === i,
            })}
          >
            <AppText className="text-lg font-bold">
              {t(routes[i].title)}
            </AppText>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const IMAGE_HEIGHT = 300;

export const WorkoutPlanDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { data: workoutPlan } = useGetWorkoutPlan(Number(id));
  const theme = use$(appStore$.theme);
  const language = use$(appStore$.language);
  const { t } = useTranslation();

  const renderHeader = () => {
    return (
      <Image
        style={[
          {
            width: "100%",
            height: IMAGE_HEIGHT,
          },
        ]}
        source={{ uri: workoutPlan?.cover_image }}
        contentFit="cover"
      />
    );
  };

  const renderTabBar = (props: TabBarProps<string>) => {
    return <TabBar {...props} />;
  };

  return (
    <AppScreen name="workout-plan-detail-screen">
      <AppHeader
        title={workoutPlan?.translations?.[0]?.name}
        withBackButton
        theme={theme}
        language={language}
      />

      <Tabs.Container
        renderHeader={renderHeader}
        headerHeight={IMAGE_HEIGHT}
        renderTabBar={renderTabBar}
      >
        <Tabs.Tab name="first">
          <Tabs.ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 12,
            }}
          >
            <PlanInfo item={workoutPlan} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="second">
          <Tabs.ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 12,
            }}
          >
            <WorkoutPlanStatistics item={workoutPlan} />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>

      <AppScreen.Footer>
        <AppScreen.FooterContainer className="px-4 py-2">
          <AppButton title={t("start_plan")} fullWidth color="primary" />
        </AppScreen.FooterContainer>
      </AppScreen.Footer>
    </AppScreen>
  );
};
