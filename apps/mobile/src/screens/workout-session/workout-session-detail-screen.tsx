import { View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppHeader } from "../../components/ui/app-header";
import {
  useDeleteWorkoutSession,
  useWorkoutSessionDetail,
} from "app/src/query/workout-session/workout-session.hooks";
import { useTranslation } from "react-i18next";
import { AppTouchable } from "../../components/ui/app-touchable";
import {
  ClockIcon,
  DeleteIcon,
  EditIcon,
  SessionDurationIcon,
  SetsCompletedIcon,
  WeightIcon,
} from "../../components/ui/expo-icon";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { Divider } from "../../components/ui/divider";
import dayjs from "dayjs";
import { convertToHourMinuteSecond } from "../../utils/convert-to-hour-minute-second";
import { twColors } from "../../styles/themes";
import { useMemo } from "react";
import { capitalize } from "lodash";
import { useModal } from "react-native-modalfy";

export const WorkoutSessionDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { openModal } = useModal();
  const router = useRouter();
  const { mutate: deleteWorkoutSession, isPending } = useDeleteWorkoutSession();

  const { data: workoutSession } = useWorkoutSessionDetail(id);
  const setsGroupByExercise = useMemo(() => {
    if (!workoutSession?.setLogs) return [];

    return workoutSession.setLogs.reduce(
      (acc, curr) => {
        if (!acc[curr.originalExerciseId]) {
          acc[curr.originalExerciseId] = {
            exerciseName: curr.exerciseNameSnapshot,
            sets: [],
          };
        }
        acc[curr.originalExerciseId].sets.push({
          order: curr.order,
          reps: curr.repetitions,
          weight: curr.weight,
          isCompleted: curr.isCompleted,
        });
        return acc;
      },
      {} as Record<
        string,
        {
          exerciseName: string;
          sets: {
            order: number;
            reps: number;
            weight: number;
            isCompleted: boolean;
          }[];
        }
      >
    );
  }, [workoutSession?.setLogs]);

  return (
    <AppScreen name="workout-session-detail-screen" isLoading={isPending}>
      <AppHeader
        title={t("session_detail")}
        withBackButton
        Right={
          <View className="flex-row items-center gap-10">
            <AppTouchable>
              <EditIcon color={twColors.blue[600]} />
            </AppTouchable>
            <AppTouchable
              onPress={() =>
                openModal("ConfirmModal", {
                  message: t("confirm_delete_session"),
                  onConfirm: () => {
                    deleteWorkoutSession(id, {
                      onSuccess: () => {
                        router.back();
                      },
                    });
                  },
                })
              }
            >
              <DeleteIcon color={twColors.red[600]} />
            </AppTouchable>
          </View>
        }
      />
      <AppScrollView
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 12,
          paddingBottom: 36,
        }}
      >
        <AppText className="text-2xl">
          {workoutSession?.workoutNameSnapshot}
        </AppText>

        <Divider className="my-4" />
        <View className="flex-row items-center gap-6">
          <ClockIcon />
          <AppText className="text-xl">
            {dayjs(workoutSession?.performedAt).format("ddd, DD MMM")}
          </AppText>
        </View>
        <Divider className="my-4" />
        <View className="flex-row items-center justify-between">
          <View className="items-center w-1/3">
            <SessionDurationIcon />
            <AppText className="mt-2">{t("duration")}</AppText>
            <AppText className="text-xl">
              {convertToHourMinuteSecond(workoutSession?.duration || 0)}
            </AppText>
          </View>
          <View className="items-center w-1/3">
            <SetsCompletedIcon />
            <AppText className="mt-2">{t("sets")}</AppText>
            <AppText className="text-xl">
              {workoutSession?.setLogs?.length}
            </AppText>
          </View>
          <View className="items-center w-1/3">
            <WeightIcon />
            <AppText className="mt-2">{t("weight")} (kg)</AppText>
            <AppText className="text-xl">
              {workoutSession?.setLogs?.reduce(
                (acc, curr) => acc + curr.weight,
                0
              )}
            </AppText>
          </View>
        </View>
        <Divider className="my-4" />

        {Object.entries(setsGroupByExercise).map(([exerciseId, exercise]) => (
          <View
            key={exerciseId}
            className="gap-2 mb-4 border-b border-slate-600 pb-4"
          >
            <AppText className="text-xl mb-4">
              {capitalize(exercise.exerciseName)}
            </AppText>
            {exercise.sets.map((set, index) => (
              <View
                key={set.order}
                className="flex-row items-center gap-2 mb-1"
              >
                <View className="w-10 h-10 rounded-full border border-gray-300 justify-center items-center mr-6">
                  <AppText>{index + 1}</AppText>
                </View>
                {set.isCompleted ? (
                  <AppText className="text-xl">
                    {set.weight} kg x {set.reps} {t("reps")}
                  </AppText>
                ) : (
                  <AppText className="text-xl">{t("incomplete")}</AppText>
                )}
              </View>
            ))}
          </View>
        ))}
      </AppScrollView>
    </AppScreen>
  );
};
