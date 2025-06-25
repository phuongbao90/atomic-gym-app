import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { Fragment, useMemo } from "react";
import { AppText } from "../../components/ui/app-text";
import { View } from "react-native";
import { SetItem } from "./components/set-item";
import { colors } from "../../styles/themes";
import { CancelIcon } from "../../components/ui/expo-icon";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { DeleteIcon } from "../../components/ui/expo-icon";
import { removeExerciseSet } from "../../stores/slices/create-workout-plan-slice";

export function EditExerciseSetsScreen() {
  const { workoutId, workoutExerciseId } = useLocalSearchParams<{
    workoutId: string;
    workoutExerciseId: string;
  }>();
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((s) => s.app.theme);
  const dispatch = useAppDispatch();
  const workouts = useAppSelector(
    (s) => s.createWorkoutPlan.workoutPlan?.workouts
  );

  const workoutExercise = useMemo(() => {
    return workouts
      ?.find((workout) => workout.id === workoutId)
      ?.workoutExercises?.find(
        (workoutExercise) => workoutExercise.id === workoutExerciseId
      );
  }, [workouts, workoutId, workoutExerciseId]);

  console.log("workoutExercise ", workoutExercise);

  function onPressMore(setIndex: number) {
    const options = [t("delete"), t("cancel")];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        showSeparators: true,
        destructiveButtonIndex: 0,
        icons: [
          <DeleteIcon key="delete" color="red" size={20} />,
          <CancelIcon key="cancel" size={20} />,
        ],
        textStyle: {
          fontSize: 18,
          fontWeight: "500",
          color: theme === "dark" ? "white" : "black",
        },

        containerStyle: {
          backgroundColor:
            theme === "dark"
              ? colors.pageBackground.dark
              : colors.pageBackground.light,
        },
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          dispatch(
            removeExerciseSet({
              workoutId,
              workoutExerciseId,
              setIndex,
            })
          );
        }
      }
    );
  }

  return (
    <AppScreen name="edit-exercise-sets-screen" safeAreaEdges={["top"]}>
      <AppHeader title={t("edit_exercise")} withBackButton />

      <AppText className="text-4xl font-bold p-6">
        {workoutExercise?.exercise?.translations?.[0]?.name}
      </AppText>

      <View className="gap-y-10 pl-6 pr-3">
        {workoutExercise?.sets?.map((set, i) => (
          <Fragment key={i.toString()}>
            <SetItem
              index={i}
              onPressMore={() => onPressMore(i)}
              workoutId={workoutId}
              workoutExerciseId={workoutExerciseId}
              exerciseSet={set}
            />
          </Fragment>
        ))}
      </View>
    </AppScreen>
  );
}
