import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useGetWorkoutPlansByMe, useGetWorkoutPlansInGroups } from "app";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SectionList,
  View,
} from "react-native";
import { AppButton } from "../../components/ui/app-button";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { Divider } from "../../components/ui/divider";
import {
  SingleWorkoutPlanCard,
  WorkoutPlanCard,
} from "../../components/workout-plan-card";
import { appRoutes } from "app-config";
import { useAppSelector } from "../../stores/redux-store";
import { useTranslation } from "react-i18next";
import { capitalize } from "lodash";
import { AppText } from "../../components/ui/app-text";
import { useSession } from "../../lib/auth-client";
import { z } from "zod";
import { WorkoutPlanItemResponseSchema } from "app-config";

export function WorkoutPlansTabScreen() {
  const router = useRouter();
  const theme = useAppSelector((state) => state.app.theme);
  const { t } = useTranslation();

  const { data: session } = useSession();
  const { data: myWorkoutPlans } = useGetWorkoutPlansByMe({
    enabled: !!session?.session,
  });

  const { data, isRefetching, refetch } = useGetWorkoutPlansInGroups();
  const sections = useMemo(() => {
    if (!data) return [];

    const sections = [
      myWorkoutPlans && myWorkoutPlans.length > 0
        ? {
            title: "my_workout_plans",
            data: myWorkoutPlans
              ? ([myWorkoutPlans] as unknown as z.infer<
                  typeof WorkoutPlanItemResponseSchema
                >[])
              : [],
          }
        : null,
      {
        title: "FEATURED",
        data: [data.isFeatured],
      },
      ...data.byCategory.map((item) => ({
        title: item.result.name,
        data: [item.result.data],
      })),
      {
        title: "SINGLE_PLANS",
        data: [data.single],
      },
    ] as {
      title: string;
      data: z.infer<typeof WorkoutPlanItemResponseSchema>[];
    }[];

    return sections.filter((item) => item?.data && item?.data.length > 0);
  }, [data, myWorkoutPlans]);

  function renderSectionHeader({
    section,
  }: { section: (typeof sections)[number] }) {
    if (!section) return null;

    const data = section.data.flat();

    if (!section.title || !data || data.length === 0) return null;

    return (
      <>
        <SectionTitle title={t(section.title)} />
        {section.title !== "SINGLE_PLANS" ? (
          <FlatList
            data={data}
            horizontal
            renderItem={({ item }) => <WorkoutPlanCard item={item} />}
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: 12,
              paddingHorizontal: 12,
            }}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View className="px-4 py-4 gap-4">
            {data?.length > 0 &&
              data.map((item) =>
                item ? (
                  <SingleWorkoutPlanCard key={item.id} item={item} />
                ) : null
              )}
          </View>
        )}
      </>
    );
  }

  return (
    <AppScreen name="workout-plans-tab-screen">
      <AppHeader title={t("workout_plans")} />
      <SectionList
        //@ts-ignore
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        initialNumToRender={100}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListFooterComponent={
          <>
            <SectionTitle title={capitalize(t("exercises"))} />
            <Pressable
              onPress={() => {
                router.push(
                  appRoutes.exercises.list({
                    mode: "default",
                  })
                );
              }}
              testID="view-all-exercises-button"
            >
              <View className="px-6 bg-slate-300 dark:bg-slate-700">
                <Divider />
                <View className="flex-row items-center gap-4 py-4">
                  <FontAwesome5
                    name="dumbbell"
                    size={20}
                    color={theme === "dark" ? "white" : "black"}
                  />
                  <AppText className="text-lg">
                    {t("view_all_exercises")}
                  </AppText>
                </View>
                <Divider />
              </View>
            </Pressable>

            <View style={{ height: 40 }} />
          </>
        }
      />
      <View className="absolute bottom-6 right-6">
        <AppButton
          testID="build-plan-button"
          title={t("build_plan")}
          onPress={() => {
            router.navigate(appRoutes.workoutPlans.create({}));
          }}
          color="primary"
          containerClassName="flex-1"
        />
      </View>
    </AppScreen>
  );
}

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <View className="px-6 py-4">
      <AppText className="text-lg font-bold uppercase">{title}</AppText>
    </View>
  );
};
