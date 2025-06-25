import { ListRenderItemInfo, TouchableOpacity, View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { router, useRouter } from "expo-router";
import { useWorkoutTimer } from "../../hooks/use-workout-timer";
import { AppText } from "../../components/ui/app-text";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import {
  ChevronLeftIcon,
  VerticalDotsIcon,
} from "../../components/ui/expo-icon";
import { Divider } from "../../components/ui/divider";
import { appRoutes } from "app-config";
import { AppButton } from "../../components/ui/app-button";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";
import React, { useRef } from "react";
import deepEqual from "deep-equal";
import { useWorkoutSessionNotification } from "../../hooks/use-workout-session-notification";
import { WorkoutExerciseItem } from "../../components/workout-exercise-item";
import { AppTouchable } from "../../components/ui/app-touchable";
import { EditSessionExerciseSheet } from "../../components/bottom-sheets/edit-session-exercise-sheet";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  removeExercise,
  reorderExercise,
  selectExercisesForList,
  setSelectedExerciseId,
} from "../../stores/slices/edit-exercise-set-slice";
import ReorderableList, {
  useReorderableDrag,
} from "react-native-reorderable-list";
import { useCreateWorkoutSession } from "app";
import { finishWorkoutSession } from "../../stores/slices/workout-session-slice";
import { CreateWorkoutSessionSchema } from "app-config";

type ExerciseListItem = ReturnType<typeof selectExercisesForList>[number];

export const InProgressWorkoutScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const debouncedPress = usePreventRepeatPress();
  const router = useRouter();
  const replaceOrDeleteSheet = useRef<BottomSheet>(null);
  const workoutExercises = useAppSelector(selectExercisesForList, deepEqual);
  // console.log(
  //   "🚀 ~ InProgressWorkoutScreen ~ workoutExercises:",
  //   JSON.stringify(workoutExercises, null, 2)
  // );

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<ExerciseListItem>) => {
    return (
      <ExerciseItem
        item={item}
        index={index}
        onPressMore={(item) => {
          dispatch(setSelectedExerciseId(item.id));
          replaceOrDeleteSheet.current?.expand();
        }}
      />
    );
  };

  return (
    <AppScreen name="in-progress-workout-screen" safeAreaEdges={["top"]}>
      <Header />
      <Divider />

      <ReorderableList
        keyExtractor={(item) => item.id}
        data={workoutExercises}
        renderItem={renderItem}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        onReorder={({ from, to }) => {
          dispatch(
            reorderExercise({
              from,
              to,
            })
          );
        }}
        ListFooterComponentStyle={{
          flexGrow: 1,
        }}
        ListFooterComponent={
          <View className="flex-1 justify-end px-2 pb-4">
            <AppButton
              testID={"add-exercise-button"}
              title={t("add_exercise")}
              radius="none"
              color="primary"
              size="lg"
              onPress={() => {
                debouncedPress(() => {
                  router.push(
                    appRoutes.exercises.list({
                      allowSelect: "true",
                      mode: "addToActiveWorkoutSession",
                    })
                  );
                });
              }}
            />
          </View>
        }
      />

      <ReplaceOrDeleteSheet modalRef={replaceOrDeleteSheet} />
    </AppScreen>
  );
};

const ReplaceOrDeleteSheet = ({
  modalRef,
}: {
  modalRef: React.RefObject<BottomSheet | null>;
}) => {
  const dispatch = useAppDispatch();
  const selectedExerciseId = useAppSelector(
    (s) => s.editExerciseSet.selectedExerciseId
  );

  return (
    <EditSessionExerciseSheet
      modalRef={modalRef}
      onDeleteItem={() => {
        if (!selectedExerciseId) return;
        dispatch(removeExercise({ id: selectedExerciseId }));
      }}
      onReplaceItem={() => {
        if (!selectedExerciseId) return;
        router.push(
          appRoutes.exercises.list({
            allowSelect: "true",
            mode: "replaceToActiveWorkoutSession",
            replaceWorkoutExerciseId: selectedExerciseId,
          })
        );
      }}
    />
  );
};

const ExerciseItem = ({
  item,
  index,
  onPressMore,
}: {
  item: ExerciseListItem;
  index: number;
  onPressMore: (item: ExerciseListItem) => void;
}) => {
  const router = useRouter();
  const drag = useReorderableDrag();

  return (
    <WorkoutExerciseItem
      index={index + 1}
      setsCount={item.setsCount}
      exerciseName={item?.name || ""}
      completedSetsCount={item.completedSetsCount}
      className="border-b border-gray-500"
      Right={
        <AppTouchable onPress={() => onPressMore(item)}>
          <VerticalDotsIcon size={28} />
        </AppTouchable>
      }
      onPress={() => {
        if (index === undefined) return;
        router.navigate(
          appRoutes.inProgress.workoutExercises(index.toString())
        );
      }}
      onLongPress={drag}
    />
  );
};

const Header = React.memo(() => {
  const router = useRouter();

  return (
    <View className="py-4 mx-4 flex-row items-center justify-center relative">
      <TouchableOpacity
        onPress={() => router.back()}
        hitSlop={10}
        className="absolute left-0"
      >
        <ChevronLeftIcon size={26} />
      </TouchableOpacity>

      <CountDown />
      <FinishButton />
    </View>
  );
});

const FinishButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { cancelRestTimeNotification } = useWorkoutSessionNotification();
  const { mutate: createWorkoutSession, isPending } = useCreateWorkoutSession();
  const activeWorkoutTemplate = useAppSelector(
    (s) => s.activeWorkoutSession.activeWorkout
  );
  const sessionExercises = useAppSelector(
    (s) => s.editExerciseSet.sessionExercises
  );
  return (
    <AppTouchable
      className="absolute right-0"
      isLoading={isPending}
      disabled={isPending}
      onPress={() => {
        if (!activeWorkoutTemplate) return;

        const {
          success,
          data: parsedData,
          error,
        } = CreateWorkoutSessionSchema.safeParse({
          completedAt: new Date(),
          duration: 100,
          notes: null,
          workoutPlanId: activeWorkoutTemplate.workoutPlanId,
          workoutTemplateId: activeWorkoutTemplate.id,
          sessionExercises: sessionExercises.map((e) => ({
            exerciseId: e.exerciseId,
            exerciseName: e.name,
            performedSets: e.sets.map((s, index) => ({
              id: s.id,
              reps: s.repetitions,
              weight: s.weight,
              isCompleted: s.isCompleted,
              restTime: s.restTime,
              setNumber: index + 1,
              duration: s.duration,
              distance: s.distance,
              performedAt: new Date(),
            })),
          })),
        });
        if (error) {
          console.error("parsing error ", JSON.stringify(error, null, 2));
        }

        if (success) {
          createWorkoutSession(parsedData, {
            onError: (error) => {
              console.log("error ", JSON.stringify(error, null, 2));
              // console.log("-------");
            },
            onSuccess: (data) => {
              console.log("data ", JSON.stringify(data, null, 2));

              cancelRestTimeNotification();
              dispatch(finishWorkoutSession());
              router.back();
            },
          });
        }
      }}
    >
      <AppText>{t("finish")}</AppText>
    </AppTouchable>
  );
};

const CountDown = React.memo(() => {
  const { formattedTime } = useWorkoutTimer();
  return (
    <AppText className="text-lg font-bold self-center">{formattedTime}</AppText>
  );
});
