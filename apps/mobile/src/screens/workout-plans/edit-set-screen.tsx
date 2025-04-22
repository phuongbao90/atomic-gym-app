import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams } from "expo-router";
import { useAppSelector } from "../../stores/redux-store";
import { useMemo } from "react";

export const EditSetScreen = () => {
  const { t } = useTranslation();
  const { workoutIndex, exerciseIndex, setIndex } = useLocalSearchParams<{
    workoutIndex: string;
    exerciseIndex: string;
    setIndex: string;
  }>();

  const workoutIndexNumber = Number(workoutIndex);
  const exerciseIndexNumber = Number(exerciseIndex);
  const setIndexNumber = Number(setIndex);

  const workoutPlan = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan
  );

  const editingSet = useMemo(() => {
    return workoutPlan?.workouts?.[workoutIndexNumber]?.exercises?.[
      exerciseIndexNumber
    ]?.sets?.[setIndexNumber];
  }, [workoutPlan, workoutIndexNumber, exerciseIndexNumber, setIndexNumber]);

  return (
    <AppScreen name="edit-set-screen">
      <AppHeader title={t("edit_set")} withBackButton />
    </AppScreen>
  );
};
