import { useGetWorkoutPlan } from "app";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import {
  CollapsibleRef,
  TabBarProps,
  Tabs,
} from "react-native-collapsible-tab-view";
import { AppButton } from "../../components/ui/app-button";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { cn } from "../../utils/cn";
import { PlanInfo } from "./components/workout-plan-info";
import { WorkoutPlanStatistics } from "./components/workout-plan-statistics";
import { useTranslation } from "react-i18next";
import { EditIcon, VerticalDotsIcon } from "../../components/ui/expo-icon";
import { appRoutes } from "app-config";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { setActiveWorkoutPlanId } from "../../stores/slices/app-slice";
import { useCallback, useEffect, useRef } from "react";
import { use$ } from "@legendapp/state/react";
import { observable } from "@legendapp/state";
import { AppTouchable } from "../../components/ui/app-touchable";
import { AppImage } from "../../components/ui/app-image";

const routes = [
  { key: "first", title: "overview" },
  { key: "second", title: "statistics" },
];

const TabBar = (props: TabBarProps<string>) => {
  const { tabNames } = props || {};
  const { t } = useTranslation();
  const activeTabIndex = use$(activeTabIndex$);

  return (
    <View className="flex-row justify-around dark:bg-slate-600">
      {tabNames.map((route, i) => (
        <Pressable
          key={route}
          onPress={() => props.onTabPress?.(route)}
          className="w-1/2"
        >
          <View
            className={cn({
              "items-center h-12 justify-center": true,
              "border-b-2 border-primary": activeTabIndex === i,
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

const activeTabIndex$ = observable(0);
const IMAGE_HEIGHT = 300;

export const WorkoutPlanDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: workoutPlan } = useGetWorkoutPlan(id);
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const activeWorkoutPlanId = useAppSelector(
    (state) => state.app.activeWorkoutPlanId
  );
  const ref = useRef<CollapsibleRef>(null);
  useEffect(() => {
    return () => {
      activeTabIndex$.set(0);
    };
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <>
        {workoutPlan?.cover_image && (
          <AppImage
            uri={workoutPlan?.cover_image}
            contentFit="cover"
            className="w-full h-full"
            style={{
              width: "100%",
              height: IMAGE_HEIGHT,
            }}
            priority={"high"}
          >
            <AppText
              className="text-2xl font-bold bottom-6 left-6 absolute text-white"
              numberOfLines={2}
              style={{ maxWidth: "90%" }}
            >
              {workoutPlan?.name}
            </AppText>
          </AppImage>
        )}
      </>
    );
  }, [workoutPlan]);

  return (
    <AppScreen
      name="workout-plan-detail-screen"
      safeAreaEdges={["top", "bottom"]}
    >
      <AppHeader
        withBackButton
        Right={
          <View className="flex-row gap-8">
            {workoutPlan?.is_owner && (
              <AppTouchable
                onPress={() => {
                  router.navigate(
                    appRoutes.workoutPlans.create({ workoutPlanId: id })
                  );
                }}
              >
                <EditIcon />
              </AppTouchable>
            )}
            <AppTouchable>
              <VerticalDotsIcon />
            </AppTouchable>
          </View>
        }
      />

      <Tabs.Container
        ref={ref}
        renderHeader={renderHeader}
        headerHeight={IMAGE_HEIGHT}
        renderTabBar={(props) => {
          return <TabBar {...props} />;
        }}
        onIndexChange={(index) => {
          activeTabIndex$.set(index);
        }}
        lazy
      >
        <Tabs.Tab name="first">
          <Tabs.ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingBottom: 80,
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
              paddingBottom: 80,
            }}
          >
            <WorkoutPlanStatistics item={workoutPlan} />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>

      <AppScreen.Footer>
        <AppScreen.FooterContainer className="px-4 py-2">
          {activeWorkoutPlanId === id ? (
            <AppButton
              title={t("cancel_plan")}
              fullWidth
              color="danger"
              className="bg-transparent border border-danger"
              textClassName="text-danger"
              size="lg"
              onPress={() => {
                dispatch(setActiveWorkoutPlanId(undefined));
                router.push(appRoutes.home);
              }}
            />
          ) : (
            <AppButton
              title={t("start_plan")}
              fullWidth
              color="primary"
              size="lg"
              onPress={() => {
                dispatch(setActiveWorkoutPlanId(id));
                router.push(appRoutes.home);
              }}
            />
          )}
        </AppScreen.FooterContainer>
      </AppScreen.Footer>
    </AppScreen>
  );
};
