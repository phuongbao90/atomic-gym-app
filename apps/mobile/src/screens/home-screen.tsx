import { queryClient, useGetWorkoutPlan, Workout } from "app";
import { useRouter } from "expo-router";
import { Button, Pressable, Text, TouchableOpacity, View } from "react-native";
import { AppScrollView } from "../../src/components/ui/app-scrollview";
import { AppStorage } from "../../src/lib/storage/app-storage";
import { AppHeader } from "../components/ui/app-header";
import { AppScreen } from "../components/ui/app-screen";
import { useAppDispatch, useAppSelector } from "../stores/redux-store";
import { logout } from "../stores/slices/auth-slice";
import { appRoutes } from "../configs/routes";
import * as SecureStore from "expo-secure-store";
import { setToken } from "../lib/auth/session-store";
import { useTranslation } from "react-i18next";
import {
  CalendarIcon,
  DumbbellIcon,
  RunIcon,
  SearchIcon,
  SettingsIcon,
} from "../components/ui/expo-icon";
import { useMemo } from "react";
import { AppText } from "../components/ui/app-text";
import { cn } from "../utils/cn";
import { Divider } from "../components/ui/divider";
import { t } from "i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WorkoutPlanCard } from "../components/workout-plan-card";
import { usePreventRepeatPress } from "../hooks/use-prevent-repeat-press";

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn);
  const activeWorkoutPlanId = useAppSelector((s) => s.app.activeWorkoutPlanId);
  const activeWorkoutId = useAppSelector(
    (s) => s.workoutSession.activeWorkout?.id
  );

  const { data: activeWorkoutPlan } = useGetWorkoutPlan(activeWorkoutPlanId);

  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AppScreen name="home-screen">
      <AppHeader
        title={t("app_name")}
        Right={
          <TouchableOpacity
            hitSlop={10}
            onPress={() => router.push(appRoutes.settings)}
          >
            <SettingsIcon size={26} />
          </TouchableOpacity>
        }
      />
      <AppScrollView

      // contentContainerStyle={{ flex: 1, paddingBottom: insets.bottom + 60 }}
      >
        <WeeklyTrack />

        <Divider className="my-4" />

        <View className="px-4">
          {activeWorkoutId ? (
            <View className="mb-4">
              <ActiveWorkout />
            </View>
          ) : null}
        </View>

        <View className="px-4">
          <AppText className="text-xl font-bold mb-4">
            {t("my_workout_plans")}
          </AppText>

          {activeWorkoutPlan ? (
            <WorkoutPlanCard item={activeWorkoutPlan} />
          ) : (
            <EmptyWorkoutPlan />
          )}
        </View>

        <View className="px-4 mt-4">
          <AppText className="text-xl font-bold mb-4">
            {t("quick_start")}
          </AppText>
          <QuickStart />
        </View>

        <DEV />
      </AppScrollView>
    </AppScreen>
  );
}

const ActiveWorkout = () => {
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();
  const activeWorkoutId = useAppSelector(
    (s) => s.workoutSession.activeWorkout?.id
  );
  const activeWorkoutName = useAppSelector(
    (s) => s.workoutSession.activeWorkout?.translations?.[0]?.name
  );
  return (
    <Pressable
      className="flex-row items-start px-4 py-4 bg-slate-200 dark:bg-slate-700 rounded-lg gap-x-4"
      onPress={() => {
        debouncedPress(() => {
          router.push(
            appRoutes.inProgress.workout(activeWorkoutId?.toString() ?? "")
          );
        });
      }}
    >
      <View className="bg-yellow-500 dark:bg-yellow-600 rounded-full items-center justify-center w-12 h-12">
        <RunIcon color={"white"} size={20} />
      </View>
      <View className="gap-y-1 flex-1">
        <AppText className="text-xl">{t("workout_in_progress")}</AppText>
        <AppText className="text-lg">{activeWorkoutName}</AppText>
      </View>
    </Pressable>
  );
};

const EmptyWorkoutPlan = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="gap-y-3">
      <Pressable
        className="flex-row items-start px-4 py-4 bg-slate-200 dark:bg-slate-700 rounded-lg gap-x-4"
        onPress={() => {
          router.push(appRoutes.plans);
        }}
      >
        <View className="bg-green-500 dark:bg-green-600 rounded-full items-center justify-center w-12 h-12">
          <SearchIcon color={"white"} size={20} />
        </View>
        <View className="gap-y-1 flex-1">
          <AppText className="text-xl">{t("find_workout_plan")}</AppText>
          <AppText className="text-lg">
            {t("find_workout_plan_description")}
          </AppText>
        </View>
      </Pressable>
      <Pressable
        className="flex-row items-start px-4 py-4 bg-slate-200 dark:bg-slate-700 rounded-lg gap-x-4"
        onPress={() => {
          router.push(appRoutes.workoutPlans.create({}));
        }}
      >
        <View className="bg-indigo-500 dark:bg-indigo-600 rounded-full items-center justify-center w-12 h-12">
          <CalendarIcon color={"white"} size={20} />
        </View>
        <View className="gap-y-1 flex-1">
          <AppText className="text-xl">{t("build_workout_plan")}</AppText>
          <AppText className="text-lg">
            {t("build_workout_plan_description")}
          </AppText>
        </View>
      </Pressable>
    </View>
  );
};

const QuickStart = () => {
  return (
    <Pressable className="flex-row items-start px-4 py-4 bg-slate-200 dark:bg-slate-700 rounded-lg gap-x-4">
      <View className="bg-orange-500 dark:bg-orange-600 rounded-full items-center justify-center w-12 h-12">
        <DumbbellIcon color={"white"} size={20} />
      </View>
      <View className="gap-y-1 flex-1">
        <AppText className="text-xl">{t("start_logging_workout")}</AppText>
        <AppText className="text-lg">
          {t("start_logging_workout_description")}
        </AppText>
      </View>
    </Pressable>
  );
};

const WeeklyTrack = () => {
  const { t } = useTranslation();

  // Generate the dates for the current week
  const weekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diff = currentDay === 0 ? 6 : currentDay - 1; // Adjust to make Monday the first day

    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);

    // Generate array for the week (Mon-Sun)
    return Array(7)
      .fill(0)
      .map((_, index) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + index);

        return {
          dayName: [
            t("mon"),
            t("tue"),
            t("wed"),
            t("thu"),
            t("fri"),
            t("sat"),
            t("sun"),
          ][index],
          date: day.getDate(),
          isToday: day.toDateString() === today.toDateString(),
        };
      });
  }, [t]);

  return (
    <View className="my-4 px-2">
      <View className="flex-row justify-between">
        {weekDays.map((day) => (
          <View
            key={`${day.dayName}-${day.date}`}
            className={"items-center gap-2"}
          >
            <AppText
              className={cn(
                "text-lg",
                day.isToday && "text-blue-600 dark:text-blue-500"
              )}
            >
              {day.dayName}
            </AppText>
            <View
              className={cn(
                "w-12 h-12 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600",
                day.isToday && "border-2 dark:border-blue-500 border-blue-600"
              )}
            >
              <AppText
                className={cn(
                  "text-lg",
                  day.isToday && "text-darken font-bold"
                )}
              >
                {day.date}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const DEV = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <View className="flex-row items-center justify-center gap-4 mt-auto">
      <Button
        title="dev ui"
        onPress={() => {
          router.push("/dev/ui");
        }}
      />

      <Button
        title="clear onboarded"
        onPress={() => {
          AppStorage.setIsOnboarded(false);
        }}
      />

      <Button
        title="logout"
        onPress={() => {
          dispatch(logout());
          SecureStore.deleteItemAsync("accessToken");
          setToken("");
          queryClient.clear();
          router.replace(appRoutes.login);
        }}
      />
    </View>
  );
};
