import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useGetWorkoutPlansByMe, useGetWorkoutPlansInGroups } from "app";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
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
import { Image } from "expo-image";

export function WorkoutPlansTabScreen() {
  const router = useRouter();
  const theme = useAppSelector((state) => state.app.theme);
  const { t } = useTranslation();

  const { data: session } = useSession();
  const { data: myWorkoutPlans } = useGetWorkoutPlansByMe({
    enabled: !!session?.session,
  });

  // 2. THE CRITICAL STEP: Prefetch all images as soon as the data arrives
  useEffect(() => {
    // Ensure we have plans to work with
    if (myWorkoutPlans && myWorkoutPlans.length > 0) {
      const imageUrls = myWorkoutPlans
        .map((plan) => plan.cover_image)
        .filter(Boolean) as string[];
      Image.prefetch(imageUrls, { cachePolicy: "memory-disk" });
    }
  }, [myWorkoutPlans]); // This effect runs once when the list data is loaded

  const { data, isRefetching, refetch } = useGetWorkoutPlansInGroups();

  useEffect(() => {
    if (data) {
      const featuredImages = data.isFeatured
        .map((plan) => plan.cover_image)
        .filter(Boolean);
      if (featuredImages.length > 0) {
        Image.prefetch(featuredImages, {
          cachePolicy: "memory-disk",
        });
      }

      const categoryImages = Object.values(data.byCategory).map((item) => {
        return item.result.data.map((plan) => plan.cover_image).filter(Boolean);
      });
      if (categoryImages.length > 0) {
        Image.prefetch(categoryImages.flat(), {
          cachePolicy: "memory-disk",
        });
      }

      // const singleImages = data.single
      //   .map((plan) => plan.cover_image)
      //   .filter(Boolean);
      // if (singleImages.length > 0) {
      //   Image.prefetch(singleImages, {
      //     cachePolicy: "memory-disk",
      //   });
      // }
    }
  }, [data]);

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
      ...data.byCategory?.map((item) => ({
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
    <AppScreen name="workout-plans-tab-screen" safeAreaEdges={["top"]}>
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
        bounces={false}
        // contentContainerStyle={{
        //   paddingBottom: 100,
        // }}
        style={{
          paddingBottom: 100,
        }}
        ListFooterComponentStyle={{
          paddingBottom: 100,
        }}
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
      <AppScreen.Footer>
        <AppButton
          testID="build-plan-button"
          title={t("build_plan")}
          onPress={() => {
            router.navigate(appRoutes.workoutPlans.create({}));
          }}
          color="primary"
          containerClassName="flex-1 px-4 pb-4"
          size="lg"
        />
      </AppScreen.Footer>
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
