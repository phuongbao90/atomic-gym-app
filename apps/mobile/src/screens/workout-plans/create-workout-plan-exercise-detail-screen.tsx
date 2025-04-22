import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export function CreateWorkoutPlanExerciseDetailScreen() {
  const { workoutIndex, index } = useLocalSearchParams<{
    workoutIndex: string;
    index: string;
  }>();
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((s) => s.app.theme);
  const dispatch = useAppDispatch();
  const workouts = useAppSelector(
    (s) => s.createWorkoutPlan.workoutPlan?.workouts
  );

  //   const workouts = useAppSelector(
  //     (s) => s.createWorkoutPlan?.workoutPlan?.workouts
  //   );
  //   const defaultSets = useAppSelector((s) => s.app.defaultSets);

  const exercise = useMemo(() => {
    return workouts?.[Number(workoutIndex)]?.exercises?.[Number(index)];
  }, [workouts, workoutIndex, index]);

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
              workoutIndex: Number(workoutIndex),
              exerciseIndex: Number(index),
              setIndex,
            })
          );
        }
      }
    );
  }

  return (
    <AppScreen name="create-workout-plan-exercise-detail-screen">
      <AppHeader title={t("edit_exercise")} withBackButton />

      <AppText className="text-4xl font-bold p-6">
        {exercise?.translations?.[0]?.name}
      </AppText>

      <View className="gap-y-10 pl-6 pr-3">
        {exercise?.sets?.map((_, i) => (
          <Fragment key={i.toString()}>
            <SetItem
              index={i}
              onPressMore={() => onPressMore(i)}
              workoutIndex={Number(workoutIndex)}
              exerciseIndex={Number(index)}
              exerciseSet={_}
            />
          </Fragment>
        ))}
      </View>
    </AppScreen>
  );
}
