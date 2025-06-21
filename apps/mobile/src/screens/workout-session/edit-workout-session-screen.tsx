import { View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppHeader } from "../../components/ui/app-header";
import { useTranslation } from "react-i18next";
import { useUpdateWorkoutSession } from "app/src/query/workout-session/workout-session.hooks";
import { CheckIcon, VerticalDotsIcon } from "../../components/ui/expo-icon";
import { WorkoutExerciseItem } from "../../components/workout-exercise-item";
import { appRoutes } from "app-config";
import { EditSessionExerciseSheet } from "../../components/bottom-sheets/edit-session-exercise-sheet";
import { useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { AppTouchable } from "../../components/ui/app-touchable";
import { toast } from "sonner-native";
import ReorderableList, {
  useReorderableDrag,
} from "react-native-reorderable-list";
import {
  reorderExercise,
  selectExercisesForList,
  selectIsEditExerciseSetDirty,
} from "../../stores/slices/edit-exercise-set-slice";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import deepEqual from "deep-equal";
import { t } from "i18next";
import { useModal } from "react-native-modalfy";
import { useIsMutating } from "@tanstack/react-query";

export const EditWorkoutSessionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  );
  const dispatch = useAppDispatch();
  const workoutExercises = useAppSelector(selectExercisesForList, deepEqual);
  const isMutating = useIsMutating();

  const renderItem = ({
    item,
    index,
  }: {
    item: ListItem;
    index: number;
  }) => {
    return (
      <Item
        item={item}
        index={index}
        sheetRef={sheetRef}
        setSelectedExerciseId={setSelectedExerciseId}
        sessionId={id}
      />
    );
  };

  return (
    <AppScreen name="edit-workout-session-screen" isLoading={isMutating > 0}>
      <Header />
      <ReorderableList
        data={workoutExercises}
        renderItem={renderItem}
        keyExtractor={(item) => {
          return item.id;
        }}
        onReorder={({ from, to }) => {
          dispatch(reorderExercise({ from, to }));
        }}
      />
      <EditSessionExerciseSheet
        modalRef={sheetRef}
        onDeleteItem={() => {
          if (!selectedExerciseId) return;
        }}
        onReplaceItem={() => {
          if (!selectedExerciseId) return;
          toast.info(t("wip"), {
            position: "bottom-center",
          });
        }}
      />
    </AppScreen>
  );
};

type ListItem = {
  id: string;
  name: string;
  order: number;
  setsCount: number;
  completedSetsCount: number;
};

const Item = ({
  item,
  index,
  sheetRef,
  setSelectedExerciseId,
  sessionId,
}: {
  item: ListItem;
  index: number;
  sheetRef: React.RefObject<BottomSheet | null>;
  setSelectedExerciseId: (exerciseId: string) => void;
  sessionId: string;
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
      onPress={() => {
        router.navigate(
          appRoutes.workoutSession.editExercise(
            sessionId,
            item.id,
            index?.toString()
          )
        );
      }}
      onLongPress={() => {
        drag();
      }}
      Right={
        <AppTouchable
          onPress={() => {
            setSelectedExerciseId(item.id);
            sheetRef.current?.expand();
          }}
        >
          <VerticalDotsIcon />
        </AppTouchable>
      }
    />
  );
};

const Header = () => {
  const router = useRouter();
  const isDirty = useAppSelector(selectIsEditExerciseSetDirty);
  const { openModal } = useModal();
  const { mutate: updateWorkoutSession } = useUpdateWorkoutSession();
  const workoutSessionName = useAppSelector(
    (state) => state.editExerciseSet.workoutSessionName
  );
  const editedWorkoutSessionId = useAppSelector(
    (state) => state.editExerciseSet.editedWorkoutSessionId
  );

  const sessionExercises = useAppSelector(
    (state) => state.editExerciseSet.sessionExercises
  );

  function handleUpdateSession() {
    if (!editedWorkoutSessionId) return;
    updateWorkoutSession(
      {
        id: editedWorkoutSessionId,
        body: {
          sessionExercises: sessionExercises.map((sessionExercise, index) => ({
            id: sessionExercise.id,
            order: index,
            exerciseId: sessionExercise.exerciseId,
            exerciseName: sessionExercise.name,
            performedSets: sessionExercise.sets.map((set) => ({
              id: set.id,
              reps: set.repetitions,
              weight: set.weight,
              isCompleted: set.isCompleted,
              setNumber: set.order,
              restTime: set.restTime,
              distance: set.distance,
              duration: set.duration,
            })),
          })),
        },
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  }

  function handleGoBack() {
    if (isDirty) {
      openModal("ConfirmModal", {
        message: t("confirm_cancel"),
        onConfirm: () => {
          router.back();
        },
      });
      return;
    }
    router.back();
  }

  return (
    <AppHeader
      title={
        <View className="flex-col gap-1 ml-4">
          <AppText className="text-xl font-bold">{t("edit_session")}</AppText>
          <AppText className="text-lg text-green-500 font-semibold">
            {workoutSessionName}
          </AppText>
        </View>
      }
      withBackButton
      onBackPress={handleGoBack}
      Right={
        <AppTouchable onPress={handleUpdateSession} disabled={!isDirty}>
          <CheckIcon disabled={!isDirty} />
        </AppTouchable>
      }
    />
  );
};
