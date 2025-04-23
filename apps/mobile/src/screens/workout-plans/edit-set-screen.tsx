import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { capitalize } from "lodash";
import { ListItem } from "../../components/ui/list-item";
import { Radio } from "../../components/ui/radio";
import { AppText } from "../../components/ui/app-text";
import {
  convertToHourMinuteSecond,
  convertToTimeObject,
  formatTimeObjectToSeconds,
} from "../../utils/convert-to-hour-minute-second";
import { CheckIcon } from "../../components/ui/expo-icon";
import { TimerPickerModal } from "react-native-timer-picker";
import { updateExerciseSet } from "../../stores/slices/create-workout-plan-slice";

export const EditSetScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { workoutId, workoutExerciseId, setIndex } = useLocalSearchParams<{
    workoutId: string;
    workoutExerciseId: string;
    setIndex: string;
  }>();
  const [showPicker, setShowPicker] = useState(false);
  const theme = useAppSelector((s) => s.app.theme);

  const dispatch = useAppDispatch();
  const [{ restTime, isWarmup, isDropSet, isUntilFailure }, setData] = useState(
    {
      restTime: 0,
      isWarmup: false,
      isDropSet: false,
      isUntilFailure: false,
    }
  );

  const workoutPlan = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan
  );

  const editingSet = useMemo(() => {
    return workoutPlan?.workouts
      ?.find((workout) => workout.id === workoutId)
      ?.workoutExercises?.find(
        (workoutExercise) => workoutExercise.id === workoutExerciseId
      )
      ?.sets?.find((_, i) => i === Number(setIndex));
  }, [workoutPlan, workoutId, workoutExerciseId, setIndex]);

  useEffect(() => {
    if (!editingSet) return;
    setData({
      restTime: editingSet.restTime,
      isWarmup: editingSet.isWarmup,
      isDropSet: editingSet.isDropSet,
      isUntilFailure: editingSet.isUntilFailure,
    });
  }, [editingSet]);

  function handleUpdate() {
    dispatch(
      updateExerciseSet({
        workoutId,
        workoutExerciseId,
        setIndex: Number(setIndex),
        set: {
          restTime,
          isWarmup,
          isDropSet,
          isUntilFailure,
        },
      })
    );

    router.back();
  }

  return (
    <AppScreen name="edit-set-screen">
      <AppHeader
        title={t("edit_set")}
        withBackButton
        Right={
          <TouchableOpacity
            className="ml-auto"
            hitSlop={10}
            onPress={handleUpdate}
          >
            <CheckIcon />
          </TouchableOpacity>
        }
      />
      <AppText className="text-2xl font-bold p-6">
        {capitalize(t("set"))} {Number(setIndex) + 1}
      </AppText>

      <ListItem
        label={capitalize(t("warmup"))}
        labelClassName="text-xl font-bold"
        containerClassName="px-6 py-5"
        withBottomDivider
        withTopDivider
        Right={
          <Radio
            selected={isWarmup}
            onPress={() =>
              setData((prev) => ({
                ...prev,
                isWarmup: !prev.isWarmup,
              }))
            }
          />
        }
      />
      <ListItem
        label={capitalize(t("drop_set"))}
        labelClassName="text-xl font-bold"
        containerClassName="px-6 py-5"
        withBottomDivider
        Right={
          <Radio
            selected={isDropSet}
            onPress={() =>
              setData((prev) => ({
                ...prev,
                isDropSet: !prev.isDropSet,
              }))
            }
          />
        }
      />
      <ListItem
        label={capitalize(t("until_failure"))}
        labelClassName="text-xl font-bold"
        containerClassName="px-6 py-5"
        withBottomDivider
        Right={
          <Radio
            selected={isUntilFailure}
            onPress={() =>
              setData((prev) => ({
                ...prev,
                isUntilFailure: !prev.isUntilFailure,
              }))
            }
          />
        }
      />
      <ListItem
        label={capitalize(t("rest_time"))}
        labelClassName="text-xl font-bold"
        containerClassName="px-6 py-5"
        withBottomDivider
        Right={
          <TouchableOpacity
            testID="rest-time-button"
            hitSlop={10}
            onPress={() => {
              setShowPicker(true);
            }}
          >
            <AppText className="text-xl">
              {convertToHourMinuteSecond(restTime)}
            </AppText>
          </TouchableOpacity>
        }
      />
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={(pickedDuration) => {
          setData((prev) => ({
            ...prev,
            restTime: formatTimeObjectToSeconds(pickedDuration),
          }));
          setShowPicker(false);
        }}
        modalTitle={capitalize(t("rest_time"))}
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        // Audio={Audio}
        // LinearGradient={LinearGradient}
        // Haptics={Haptics}
        styles={{
          theme: theme,
        }}
        modalProps={{
          overlayOpacity: 0.4,
        }}
        initialValue={convertToTimeObject(restTime)}
        hideHours
        confirmButtonText={t("confirm")}
        cancelButtonText={t("cancel")}
      />
    </AppScreen>
  );
};
