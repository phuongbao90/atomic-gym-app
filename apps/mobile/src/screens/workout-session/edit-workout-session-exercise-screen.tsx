import { View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useUpdateWorkoutSessionExerciseSets,
  useWorkoutSessionDetail,
} from "app/src/query/workout-session/workout-session.hooks";
import { AppHeader } from "../../components/ui/app-header";
import { useTranslation } from "react-i18next";
import { SetExerciseHeader } from "../../components/set-exercise-header";
import { useGetExercise, WorkoutSessionExerciseSet } from "app";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppFlatList } from "../../components/ui/app-flat-list";
import { AppTouchable } from "../../components/ui/app-touchable";
import { CheckIcon, PlusCircleIcon } from "../../components/ui/expo-icon";
import BottomSheet from "@gorhom/bottom-sheet";
import { ExerciseSetItemSheet } from "../../components/bottom-sheets/exercise-set-item-sheet";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import {
  addExerciseSet,
  editExerciseSet,
  removeExerciseSet,
  resetEditExerciseSet,
  cloneExerciseSets,
} from "../../stores/slices/edit-exercise-set.slice";
import { useModal } from "react-native-modalfy";
import { CompletedSetItem } from "../../components/exercise-set-item/completed-exercise-set-item";
import { IncompletedSetItem } from "../../components/exercise-set-item/incompleted-exercise-set-item";
import { toast } from "sonner-native";

export const EditWorkoutSessionExerciseScreen = () => {
  const router = useRouter();
  const { sessionId, exerciseId } = useLocalSearchParams<{
    sessionId: string;
    exerciseId: string;
  }>();
  const { openModal } = useModal();
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const completedSetSheetRef = useRef<BottomSheet>(null);
  const incompletedSetSheetRef = useRef<BottomSheet>(null);
  const { data: workoutSession, refetch } = useWorkoutSessionDetail(sessionId);
  const exercise = useGetExercise(exerciseId);
  const { mutate: updateWorkoutSessionExerciseSets, isPending } =
    useUpdateWorkoutSessionExerciseSets();
  const { t } = useTranslation();

  useEffect(() => {
    if (workoutSession) {
      dispatch(
        cloneExerciseSets(
          workoutSession.setLogs.filter(
            (log) => log.originalExerciseId === exerciseId
          )
        )
      );
    }
  }, [workoutSession, dispatch, exerciseId]);

  const _exerciseSets = useAppSelector(
    (state) => state.editExerciseSet.exerciseSetLogs
  );
  const exerciseSets = useMemo(() => {
    return _exerciseSets.filter((set) => set.type !== "delete");
  }, [_exerciseSets]);
  const isDirty = useAppSelector((state) => state.editExerciseSet.isDirty);

  const onSubmitChanges = useCallback(() => {
    const setLogsToCreate = _exerciseSets.filter(
      (set) => set.type === "create"
    );
    const setLogsToUpdate = _exerciseSets.filter(
      (set) => set.type === "update"
    );
    const setLogsToDelete = _exerciseSets.filter(
      (set) => set.type === "delete"
    );

    console.log("🚀 ~ onSubmitChanges ~ setLogsToCreate:", setLogsToCreate);
    console.log("🚀 ~ onSubmitChanges ~ setLogsToUpdate:", setLogsToUpdate);
    console.log("🚀 ~ onSubmitChanges ~ setLogsToDelete:", setLogsToDelete);

    updateWorkoutSessionExerciseSets(
      {
        id: sessionId,
        exerciseId,
        body: {
          setLogsToCreate,
          setLogsToUpdate,
          setLogsToDelete: setLogsToDelete.map((set) => set.id),
        },
      },
      {
        onSuccess: () => {
          refetch();
          router.back();
        },
        onError: (err) => {
          console.error("updateWorkoutSessionExerciseSets error", err);
          toast.error(t("error_occurred"));
        },
      }
    );
  }, [_exerciseSets, exerciseId, sessionId]);

  useEffect(() => {
    return () => {
      dispatch(resetEditExerciseSet());
    };
  }, [dispatch]);

  const renderItem = ({
    item,
    index,
  }: { item: WorkoutSessionExerciseSet; index: number }) => {
    if (item.isCompleted) {
      return (
        <CompletedSetItem
          exerciseSet={item}
          index={index}
          onPressMore={() => {
            setSelectedSetId(item.id);
            completedSetSheetRef.current?.expand();
          }}
        />
      );
    }

    return (
      <IncompletedSetItem
        exerciseSet={item}
        index={index}
        onPressMore={() => {
          setSelectedSetId(item.id);
          incompletedSetSheetRef.current?.expand();
        }}
      />
    );
  };

  return (
    <AppScreen
      name="edit-workout-session-exercise-screen"
      isLoading={isPending}
    >
      <AppHeader
        title={
          <View className="flex-col gap-1 ml-4">
            <AppText className="text-xl font-bold">{t("edit_session")}</AppText>
            <AppText className="text-lg text-green-500 font-semibold">
              {workoutSession?.workoutNameSnapshot}
            </AppText>
          </View>
        }
        withBackButton
        Right={
          <AppTouchable disabled={!isDirty} onPress={onSubmitChanges}>
            <CheckIcon disabled={!isDirty} />
          </AppTouchable>
        }
        onBackPress={() => {
          if (isDirty) {
            openModal("ConfirmModal", {
              message: t("confirm_cancel"),
              onConfirm: () => {
                router.back();
              },
            });
          } else {
            router.back();
          }
        }}
      />

      <AppFlatList
        ListHeaderComponent={
          <SetExerciseHeader
            exerciseId={exerciseId}
            exerciseImageUrl={exercise?.data?.images?.[0]}
            exerciseName={exercise?.data?.translations?.[0]?.name}
          />
        }
        ListHeaderComponentStyle={{
          marginTop: 12,
        }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          gap: 16,
        }}
        data={exerciseSets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => {
          return (
            <AppTouchable
              className="items-center my-8"
              onPress={() => {
                dispatch(
                  addExerciseSet({
                    exerciseId,
                    exerciseName: exercise?.data?.translations?.[0]?.name || "",
                  })
                );
              }}
            >
              <View className="flex-row items-center gap-2">
                <PlusCircleIcon size={24} />
                <AppText className="text-lg font-bold">{t("add_set")}</AppText>
              </View>
            </AppTouchable>
          );
        }}
      />

      <ExerciseSetItemSheet
        modalRef={completedSetSheetRef}
        onEditItem={() => {
          if (selectedSetId) dispatch(editExerciseSet({ id: selectedSetId }));
        }}
        onDeleteItem={() => {
          if (selectedSetId) dispatch(removeExerciseSet({ id: selectedSetId }));
        }}
      />
      <ExerciseSetItemSheet
        modalRef={incompletedSetSheetRef}
        onDeleteItem={() => {
          if (selectedSetId) dispatch(removeExerciseSet({ id: selectedSetId }));
        }}
      />
    </AppScreen>
  );
};
