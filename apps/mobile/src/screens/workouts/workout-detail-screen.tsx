import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetWorkoutTemplate } from "app";
import { View } from "react-native";
import { ExerciseItem } from "../../components/exercise-item";
import { AppFlatList } from "../../components/ui/app-flat-list";
import { AppButton } from "../../components/ui/app-button";
import { useTranslation } from "react-i18next";
import { AppText } from "../../components/ui/app-text";
import { useAppDispatch } from "../../stores/redux-store";
import { appRoutes } from "../../configs/routes";
import { startWorkout } from "../../stores/slices/workout-session-slice";
import { cloneExercises } from "../../stores/slices/edit-exercise-set-slice";

export function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: workout, isLoading } = useGetWorkoutTemplate(id);

  return (
    <AppScreen name="workout-detail-screen">
      <AppHeader title={workout?.name} withBackButton />

      <AppFlatList
        data={workout?.templateExercises}
        renderItem={({ item, index }) => (
          <ExerciseItem
            item={item?.exercise}
            index={index}
            setCount={item?.templateSets?.length}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 60,
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <AppText>{t("no_exercises")}</AppText>
          </View>
        )}
      />
      <AppScreen.Footer>
        <AppButton
          testID="start-workout-button"
          title={t("start_workout")}
          fullWidth
          containerClassName="px-4 pb-4"
          radius="xl"
          color="primary"
          onPress={() => {
            if (workout) {
              dispatch(
                startWorkout({
                  id: workout.id,
                  name: workout.name,
                  slug: workout.slug,
                  workoutPlanId: workout.workoutPlanId,
                })
              );
              dispatch(
                cloneExercises(
                  workout.templateExercises?.map((e, index) => ({
                    id: e.exerciseId,
                    name: e.exercise?.name || "",
                    order: e.order,
                    images: e.exercise?.images || [],
                    exerciseId: e.exerciseId,
                    sets:
                      e.templateSets?.map((s) => ({
                        id: s.id,
                        isCompleted: false,
                        weight: 0,
                        repetitions: 0,
                        distance: 0,
                        duration: 0,
                        order: index,
                        originalExerciseId: e.exerciseId,
                        exerciseNameSnapshot: e.exercise?.name || "",
                        restTime: 0,
                        type: "untouched",
                      })) || [],
                  })) || []
                )
              );
              router.push(appRoutes.inProgress.workout(id));
            }
          }}
        />
      </AppScreen.Footer>
    </AppScreen>
  );
}
