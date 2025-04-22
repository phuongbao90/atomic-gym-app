import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppSelector } from "../../stores/redux-store";
import { useMemo } from "react";
import { AppText } from "../../components/ui/app-text";

export function CreateWorkoutPlanExerciseDetailScreen() {
  const { workoutIndex, index } = useLocalSearchParams<{
    workoutIndex: string;
    index: string;
  }>();
  const { t } = useTranslation();
  const router = useRouter();

  const workouts = useAppSelector(
    (s) => s.createWorkoutPlan?.workoutPlan?.workouts
  );

  const exercise = useMemo(() => {
    return workouts?.[Number(workoutIndex)]?.exercises?.[Number(index)];
  }, [workouts, workoutIndex, index]);

  return (
    <AppScreen name="create-workout-plan-exercise-detail-screen">
      <AppHeader title={t("edit_exercise")} withBackButton />

      <AppText className="text-2xl font-bold">
        {exercise?.translations?.[0]?.name}
      </AppText>
    </AppScreen>
  );
}
