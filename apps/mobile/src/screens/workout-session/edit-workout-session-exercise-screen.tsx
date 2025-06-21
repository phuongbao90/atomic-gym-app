import { View } from "react-native";
import React from "react";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useLocalSearchParams } from "expo-router";
import { AppHeader } from "../../components/ui/app-header";
import { useTranslation } from "react-i18next";
import { SetExerciseHeader } from "../../components/set-exercise-header";
import { Fragment, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { ExerciseSetItemSheet } from "../../components/bottom-sheets/exercise-set-item-sheet";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import {
  editExerciseSet,
  removeExerciseSet,
  selectExerciseSetsByPageIndex,
  selectExercisesForPagerView,
  setSelectedSetId,
} from "../../stores/slices/edit-exercise-set-slice";
import { CompletedSetItem } from "../../components/exercise-set-item/completed-exercise-set-item";
import { IncompletedSetItem } from "../../components/exercise-set-item/incompleted-exercise-set-item";
import deepEqual from "deep-equal";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";
import { HistoryAndNotes } from "../../components/set-history-note";
import { AddNotesToWorkoutExerciseSheet } from "../../components/bottom-sheets/add-notes-to-workout-exercise-sheet";
import { ExerciseSetPagerDots } from "../../components/exercise-set-pager-dots";
import { Divider } from "../../components/ui/divider";

export const EditWorkoutSessionExerciseScreen = () => {
  const { pageIndex } = useLocalSearchParams<{
    pageIndex: string;
  }>();
  const workoutExercises = useAppSelector(
    selectExercisesForPagerView,
    deepEqual
  );
  const [activePage, setActivePage] = useState(Number(pageIndex));
  const completedSetSheetRef = useRef<BottomSheet>(null);
  const incompletedSetSheetRef = useRef<BottomSheet>(null);
  // const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const selectedSetId = useAppSelector((s) => s.editExerciseSet.selectedSetId);

  const workoutSessionName = useAppSelector(
    (s) => s.editExerciseSet.workoutSessionName
  );

  const { t } = useTranslation();
  const deletedSetIds = useAppSelector((state) =>
    selectDeletedSetIds(state, 0)
  );

  // console.log("workoutExercises ", JSON.stringify(workoutExercises, null, 2));

  return (
    <AppScreen name="edit-workout-session-exercise-screen">
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
        withBottomBorder={false}
      />

      <View className="mb-3">
        <ExerciseSetPagerDots
          activePage={activePage}
          pages={workoutExercises?.length || 0}
        />
      </View>
      <Divider />

      <PagerView
        style={{ flex: 1 }}
        initialPage={activePage}
        onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
      >
        {workoutExercises?.map((workoutExercise, index) => (
          <WorkoutExercisePage
            key={workoutExercise.id}
            pageIndex={index}
            completedSetSheetRef={completedSetSheetRef}
            incompletedSetSheetRef={incompletedSetSheetRef}
            exercise={{
              id: workoutExercise.id,
              name: workoutExercise.name,
              images: workoutExercise.images,
            }}
          />
        ))}
      </PagerView>

      <ExerciseSetItemSheet
        modalRef={completedSetSheetRef}
        onEditItem={() => {
          if (selectedSetId)
            dispatch(
              editExerciseSet({ id: selectedSetId, pageIndex: activePage })
            );
        }}
        onDeleteItem={() => {
          if (selectedSetId)
            dispatch(
              removeExerciseSet({ id: selectedSetId, pageIndex: activePage })
            );
        }}
      />
      <ExerciseSetItemSheet
        modalRef={incompletedSetSheetRef}
        onDeleteItem={() => {
          if (selectedSetId)
            dispatch(
              removeExerciseSet({ id: selectedSetId, pageIndex: activePage })
            );
        }}
      />
    </AppScreen>
  );
};

const WorkoutExercisePage = React.memo(
  ({
    pageIndex,
    exercise,
    completedSetSheetRef,
    incompletedSetSheetRef,
  }: {
    pageIndex: number;
    exercise: { id: string; name: string; images: string[] | undefined };
    completedSetSheetRef: React.RefObject<BottomSheet | null>;
    incompletedSetSheetRef: React.RefObject<BottomSheet | null>;
  }) => {
    const insets = useSafeAreaInsets();
    const noteRef = useRef<BottomSheet>(null);
    const historyRef = useRef<BottomSheet>(null);
    const exerciseSets = useAppSelector(
      (s) => selectExerciseSetsByPageIndex(s, pageIndex),
      deepEqual
    );

    const dispatch = useAppDispatch();

    const renderItem = ({
      item,
      index,
    }: {
      item: { id: string; isCompleted: boolean; restTime?: number };
      index: number;
    }) => {
      if (item.isCompleted) {
        return (
          <CompletedSetItem
            index={index}
            pageIndex={pageIndex}
            exerciseSetId={item.id}
            onPressMore={() => {
              dispatch(setSelectedSetId(item.id));
              completedSetSheetRef.current?.expand();
            }}
          />
        );
      }

      return (
        <IncompletedSetItem
          index={index}
          pageIndex={pageIndex}
          exerciseSetId={item.id}
          onPressMore={() => {
            dispatch(setSelectedSetId(item.id));
            incompletedSetSheetRef.current?.expand();
          }}
        />
      );
    };

    if (!exerciseSets) return null;

    return (
      <View key={exercise.id} className="flex-1">
        <LegendList
          keyExtractor={(item) => item.id}
          data={exerciseSets}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: insets.bottom + 60,
          }}
          style={{ flex: 1 }}
          ListHeaderComponent={
            <Fragment>
              <SetExerciseHeader
                exerciseId={exercise.id}
                exerciseImageUrl={exercise.images?.[0]}
                exerciseName={exercise.name}
              />
              <View className="my-2">
                <HistoryAndNotes
                  noteRef={noteRef}
                  historyRef={historyRef}
                  workoutExerciseId={exercise.id}
                />
              </View>
            </Fragment>
          }
          ItemSeparatorComponent={() => <View className="my-2" />}
          recycleItems
          maintainVisibleContentPosition
        />
        <AddNotesToWorkoutExerciseSheet
          modalRef={noteRef}
          workoutExerciseId={exercise.id}
        />
      </View>
    );
  }
);
