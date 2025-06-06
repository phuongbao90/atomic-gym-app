import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { ChevronLeftIcon, XIcon } from "../../components/ui/expo-icon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppText } from "../../components/ui/app-text";
import { Divider } from "../../components/ui/divider";
import { useTranslation } from "react-i18next";
import { useWorkoutTimer } from "../../hooks/use-workout-timer";
import PagerView from "react-native-pager-view";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { InProgressWorkoutExercisesScreenParams } from "../../configs/routes";
import React, { Fragment, useRef, useState } from "react";
import { setCountDownRestTimeEndTime } from "../../stores/slices/workout-session-slice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import { convertToHourMinuteSecond } from "../../utils/convert-to-hour-minute-second";
import { useCountDownRestTime } from "../../hooks/use-count-down-rest-time";
import { AddNotesToWorkoutExerciseSheet } from "../../components/bottom-sheets/add-notes-to-workout-exercise-sheet";
import { useWorkoutSessionNotification } from "../../hooks/use-workout-session-notification";
import { SetExerciseHeader } from "../../components/set-exercise-header";
import { ExerciseSetItemSheet } from "../../components/bottom-sheets/exercise-set-item-sheet";
import { CompletedSetItem } from "../../components/exercise-set-item/completed-exercise-set-item";
import { HistoryAndNotes } from "../../components/set-history-note";
import { IncompletedSetItem } from "../../components/exercise-set-item/incompleted-exercise-set-item";
import { ExerciseSetPagerDots } from "../../components/exercise-set-pager-dots";
import {
  selectExercisesForPagerView,
  selectExerciseSetsByPageIndex,
  setSelectedSetId,
} from "../../stores/slices/edit-exercise-set-slice";
import deepEqual from "deep-equal";
import { LegendList } from "@legendapp/list";

export const InProgressWorkoutExercisesScreen = () => {
  const { pageIndex } =
    useLocalSearchParams<InProgressWorkoutExercisesScreenParams>();

  const workoutExercises = useAppSelector(
    selectExercisesForPagerView,
    deepEqual
  );

  const [activePage, setActivePage] = useState(Number(pageIndex));
  const completedSetSheetRef = useRef<BottomSheet>(null);
  const incompletedSetSheetRef = useRef<BottomSheet>(null);

  return (
    <AppScreen name="in-progress-workout-exercises-screen">
      <Header />
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
              image: "",
            }}
          />
        ))}
      </PagerView>

      <RestTimeCountDown />
      <ExerciseSetItemSheet
        modalRef={completedSetSheetRef}
        onEditItem={() => {
          // if (selectedSetId) dispatch(editExerciseSet({ id: selectedSetId }));
        }}
        onDeleteItem={() => {
          // if (selectedSetId) dispatch(removeExerciseSet({ id: selectedSetId }));
        }}
      />
      <ExerciseSetItemSheet
        modalRef={incompletedSetSheetRef}
        onDeleteItem={() => {
          // if (selectedSetId) dispatch(removeExerciseSet({ id: selectedSetId }));
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
    exercise: { id: string; name: string; image: string };
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
    const { notifyRestTime } = useWorkoutSessionNotification();

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
          onCompleteSet={() => {
            notifyRestTime(item.restTime || 60);
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
                exerciseImageUrl={exercise.image}
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

const CountDown = () => {
  const { formattedTime } = useWorkoutTimer();
  return (
    <AppText className="text-lg font-bold self-center">{formattedTime}</AppText>
  );
};

const RestTimeCountDown = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const countdownRestTimeEndTime = useAppSelector(
    (s) => s.activeWorkoutSession.countdownRestTimeEndTime
  );
  const countdown = useCountDownRestTime({
    to: countdownRestTimeEndTime,
    onComplete: () => {
      dispatch(setCountDownRestTimeEndTime({ restTime: 0 }));
    },
  });
  const { cancelRestTimeNotification } = useWorkoutSessionNotification();

  if (!countdownRestTimeEndTime || !countdown) return null;

  return (
    <View className="h-16 bg-slate-600 dark:bg-slate-700 flex-row items-center gap-x-4 px-4">
      <TouchableOpacity
        hitSlop={10}
        onPress={() => {
          dispatch(setCountDownRestTimeEndTime({ restTime: 0 }));
          cancelRestTimeNotification();
        }}
      >
        <XIcon />
      </TouchableOpacity>
      <AppText className="text-lg font-bold self-center">
        {t("rest_time")}: {convertToHourMinuteSecond(countdown)}
      </AppText>
    </View>
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
    </View>
  );
});
