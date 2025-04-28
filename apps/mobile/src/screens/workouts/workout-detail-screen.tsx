import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetWorkout } from "app";
import { ActivityIndicator, View } from "react-native";
import { ExerciseItem } from "../../components/exercise-item";
import { AppFlatList } from "../../components/ui/app-flat-list";
import { AppButton } from "../../components/ui/app-button";
import { useTranslation } from "react-i18next";
import { AppText } from "../../components/ui/app-text";
import { useAppDispatch } from "../../stores/redux-store";
import { appRoutes } from "../../configs/routes";
import { startWorkout } from "../../stores/slices/workout-session-slice";

export function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: workout, isLoading } = useGetWorkout(id);

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        testID="loading-indicator"
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AppScreen name="workout-detail-screen">
      <AppHeader title={workout?.translations?.[0]?.name} withBackButton />

      <AppFlatList
        data={workout?.workoutExercises}
        renderItem={({ item, index }) => (
          <ExerciseItem
            item={item?.exercise}
            index={index}
            setCount={item?.sets?.length}
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
              dispatch(startWorkout(workout));
              router.push(appRoutes.inProgress.workout(id));
            }
          }}
        />
      </AppScreen.Footer>
    </AppScreen>
  );
}
