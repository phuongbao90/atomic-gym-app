import { RefreshControl, View } from "react-native";
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
import { convertToHourMinuteSecond } from "../../utils/convert-to-hour-minute-second";
import { twColors } from "../../styles/themes";
import { capitalize } from "lodash";
import { useModal } from "react-native-modalfy";
import { appRoutes } from "app-config";
import { OrderNumberCircle } from "../../components/ui/OrderNumberCircle";
import { dayjs } from "../../lib/dayjs";
import { useMemo } from "react";
import { useAppDispatch } from "../../stores/redux-store";
import {
  cloneExercises,
  setEditedWorkoutSessionId,
  setWorkoutSessionName,
} from "../../stores/slices/edit-exercise-set-slice";

export const WorkoutSessionDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { openModal } = useModal();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate: deleteWorkoutSession, isPending } = useDeleteWorkoutSession();
  const { data: workoutSession, refetch } = useWorkoutSessionDetail(id);

  const totalWeight = useMemo(() => {
    return workoutSession?.sessionExercises?.reduce(
      (acc, curr) =>
        acc +
        curr.performedSets?.reduce((acc, curr) => acc + (curr.weight ?? 0), 0),
      0
    );
  }, [workoutSession]);

  const data = useMemo(() => {
    if (!workoutSession) return [];

    const sessionExercises = workoutSession.sessionExercises;

    return sessionExercises.map((sessionExercise) => {
      return {
        id: sessionExercise.id,
        name: sessionExercise.exercise.name,
        images: sessionExercise.exercise.images,
        exerciseId: sessionExercise.exercise.id,
        sets: sessionExercise.performedSets.map((set, index) => {
          return {
            id: set.id,
            weight: set.weight ?? 0,
            repetitions: set.reps ?? 0,
            distance: set.distance ?? 0,
            duration: set.duration ?? 0,
            isCompleted: set.isCompleted,
            restTime: set.restTime ?? 0,
            notes: "",
            order: index + 1,
            type: "untouched" as const,
          };
        }),
      };
    });
  }, [workoutSession]);

  return (
    <AppScreen name="workout-session-detail-screen" isLoading={isPending}>
      <AppHeader
        title={t("session_detail")}
        withBackButton
        Right={
          <View className="flex-row items-center gap-10">
            <AppTouchable
              onPress={() => {
                dispatch(cloneExercises(data));
                if (workoutSession?.workoutTemplate?.name) {
                  dispatch(
                    setWorkoutSessionName(workoutSession?.workoutTemplate?.name)
                  );
                }
                dispatch(setEditedWorkoutSessionId(id));

                router.push(appRoutes.workoutSession.edit(id));
              }}
            >
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
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        <AppText className="text-2xl">
          {workoutSession?.workoutTemplate?.name}
        </AppText>

        <Divider className="my-4" />
        <View className="flex-row items-center gap-6">
          <ClockIcon />
          <AppText className="text-xl">
            {dayjs(workoutSession?.completedAt)?.format("ddd, DD MMM")}
          </AppText>
          <AppTouchable
            className="ml-auto mr-2"
            onPress={() => {
              router.navigate(appRoutes.workoutSession.editSessionDate(id));
            }}
          >
            <EditIcon />
          </AppTouchable>
        </View>
        <Divider className="my-4" />
        <View className="flex-row items-center justify-between">
          <View className="items-center w-1/3">
            <SessionDurationIcon />
            <AppText className="mt-2 text-xl">{t("duration")}</AppText>
            <AppText className="text-xl">
              {convertToHourMinuteSecond(workoutSession?.duration || 0)}
            </AppText>
          </View>
          <View className="items-center w-1/3">
            <SetsCompletedIcon />
            <AppText className="mt-2 text-xl">{capitalize(t("sets"))}</AppText>
            <AppText className="text-xl">
              {workoutSession?.sessionExercises?.length}
            </AppText>
          </View>
          <View className="items-center w-1/3">
            <WeightIcon />
            <AppText className="mt-2 text-xl">{t("weight")} (kg)</AppText>
            <AppText className="text-xl">{totalWeight}</AppText>
          </View>
        </View>
        <Divider className="my-4" />

        {workoutSession?.sessionExercises?.map((exercise) => (
          <View
            key={exercise.id}
            className="gap-2 mb-4 border-b border-slate-600 pb-4"
          >
            <AppText className="text-xl mb-4">
              {capitalize(exercise.exercise.name)}
            </AppText>
            {exercise.performedSets.map((set, index) => (
              <View
                key={set.id || index}
                className="flex-row items-center gap-2 mb-1"
              >
                <OrderNumberCircle
                  orderNumber={index + 1}
                  className="mr-4 w-10 h-10 "
                />
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
