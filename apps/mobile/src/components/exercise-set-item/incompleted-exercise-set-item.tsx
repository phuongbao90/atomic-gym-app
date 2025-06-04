import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { capitalize } from "lodash";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  VerticalDotsIcon,
} from "../ui/expo-icon";
import { Pressable, TextInput, View } from "react-native";
import { AppText } from "../ui/app-text";
import { AppTouchable } from "../ui/app-touchable";
import { useWorkoutSessionNotification } from "../../hooks/use-workout-session-notification";
import { Divider } from "../ui/divider";
import { AppButton } from "../ui/app-button";
import { toast } from "sonner-native";
import { ExerciseSetItemProps } from "./exercise-set-item-type";
import {
  completeSet,
  updateExerciseSet,
} from "../../stores/slices/edit-exercise-set.slice";
import { useHoldAction } from "../../hooks/use-hold-action";

export const IncompletedSetItem = ({
  index,
  exerciseSet,
  onPressMore,
  onCompleteSet,
}: {
  index: number;
  exerciseSet: ExerciseSetItemProps["exerciseSet"];
  onPressMore: () => void;
  onCompleteSet?: () => void;
}) => {
  const { t } = useTranslation();
  const weightUnit = useAppSelector((s) => s.app.weightUnit);
  // const { notifyRestTime } = useWorkoutSessionNotification();
  const dispatch = useAppDispatch();
  const incrementWeight = useAppSelector((s) => s.app.weightIncrement);

  const { start: startIncreaseWeight, stop: stopIncreaseWeight } =
    useHoldAction(() => {
      dispatch(
        updateExerciseSet({
          id: exerciseSet.id,
          type: "weight",
          direction: "increase",
          step: incrementWeight,
        })
      );
    });
  const { start: startIncreaseReps, stop: stopIncreaseReps } = useHoldAction(
    () => {
      dispatch(
        updateExerciseSet({
          id: exerciseSet.id,
          type: "reps",
          direction: "increase",
          step: 1,
        })
      );
    }
  );
  const { start: startDecreaseWeight, stop: stopDecreaseWeight } =
    useHoldAction(() => {
      dispatch(
        updateExerciseSet({
          id: exerciseSet.id,
          type: "weight",
          direction: "decrease",
          step: incrementWeight,
        })
      );
    });
  const { start: startDecreaseReps, stop: stopDecreaseReps } = useHoldAction(
    () => {
      dispatch(
        updateExerciseSet({
          id: exerciseSet.id,
          type: "reps",
          direction: "decrease",
          step: 1,
        })
      );
    }
  );

  return (
    <View className="rounded-xl overflow-hidden bg-slate-700">
      <View className="flex-row items-center justify-center py-4 bg-slate-600">
        <AppText className="text-lg">
          {capitalize(t("set"))} {index + 1}{" "}
        </AppText>
        <AppTouchable
          onPress={() => onPressMore?.()}
          className="absolute right-3"
        >
          <VerticalDotsIcon />
        </AppTouchable>
      </View>
      <View className="py-5">
        <AppText className="text-lg text-center mb-3">
          {t("weight")} ({weightUnit})
        </AppText>

        <View className="flex-row items-center justify-between px-6">
          <Pressable
            hitSlop={20}
            onPressIn={() => startDecreaseWeight()}
            onPressOut={() => stopDecreaseWeight()}
            onResponderRelease={() => stopDecreaseWeight()}
          >
            <MinusCircleIcon />
          </Pressable>

          <TextInput
            className="text-4xl text-center text-white"
            value={exerciseSet?.weight.toString()}
            keyboardType="number-pad"
            onChangeText={(text) => {
              dispatch(
                updateExerciseSet({
                  id: exerciseSet.id,
                  type: "weight",
                  value: text,
                })
              );
            }}
          />

          <Pressable
            hitSlop={20}
            onPressIn={() => startIncreaseWeight()}
            onPressOut={() => stopIncreaseWeight()}
            onResponderRelease={() => stopIncreaseWeight()}
          >
            <PlusCircleIcon />
          </Pressable>
        </View>
      </View>

      <Divider className="border-b-[0.7px] border-slate-600" />

      <View className="py-5">
        <AppText className="text-lg text-center mb-3">{t("reps")}</AppText>

        <View className="flex-row items-center justify-between px-6">
          <Pressable
            hitSlop={20}
            onPressIn={() => startDecreaseReps()}
            onPressOut={() => stopDecreaseReps()}
            onResponderRelease={() => stopDecreaseReps()}
          >
            <MinusCircleIcon />
          </Pressable>

          <TextInput
            className="text-4xl text-center text-white"
            value={exerciseSet?.repetitions.toString()}
            keyboardType="number-pad"
            onChangeText={(text) => {
              dispatch(
                updateExerciseSet({
                  id: exerciseSet.id,
                  type: "reps",
                  value: text,
                })
              );
            }}
          />

          <Pressable
            hitSlop={20}
            onPressIn={() => startIncreaseReps()}
            onPressOut={() => stopIncreaseReps()}
            onResponderRelease={() => stopIncreaseReps()}
          >
            <PlusCircleIcon />
          </Pressable>
        </View>
      </View>

      <AppButton
        color="primary"
        title={t("complete_set")}
        size="lg"
        onPress={() => {
          if (!exerciseSet.weight || !exerciseSet.repetitions) {
            toast.error(t("please_fill_all_fields"), {
              position: "bottom-center",
            });
            return;
          }
          dispatch(completeSet({ id: exerciseSet.id }));
          onCompleteSet?.();

          // notifyRestTime(exerciseSet?.restTime || 0);
        }}
      />
    </View>
  );
};
