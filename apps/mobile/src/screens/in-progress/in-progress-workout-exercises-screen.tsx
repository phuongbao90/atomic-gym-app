import { FlatList, Touchable, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import {
  CancelIcon,
  ChevronLeftIcon,
  DeleteIcon,
  EditIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  VerticalDotsIcon,
  XIcon,
} from "../../components/ui/expo-icon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppText } from "../../components/ui/app-text";
import { Divider } from "../../components/ui/divider";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";
import { useTranslation } from "react-i18next";
import { useWorkoutTimer } from "../../hooks/use-workout-timer";
import PagerView from "react-native-pager-view";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { InProgressWorkoutExercisesScreenParams } from "../../configs/routes";
import React, { Fragment, useRef, useState } from "react";
import { ExerciseSet } from "app";
import { Image } from "expo-image";
import {
  completeActiveWorkoutSessionExerciseSet,
  decreaseExerciseSetValue,
  deleteActiveWorkoutSessionExerciseSet,
  increaseExerciseSetValue,
  setCountDownRestTimeEndTime,
  undoCompleteActiveWorkoutSessionExerciseSet,
} from "../../stores/slices/workout-session-slice";
import { capitalize } from "lodash";
import { AppButton } from "../../components/ui/app-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "../../styles/themes";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { toast } from "sonner-native";
import { convertToHourMinuteSecond } from "../../utils/convert-to-hour-minute-second";
import { useCountDownRestTime } from "../../hooks/use-count-down-rest-time";
import { shallowEqual } from "react-redux";
import { AddNotesToWorkoutExerciseSheet } from "../../components/bottom-sheets/add-notes-to-workout-exercise-sheet";
import { useWorkoutSessionNotification } from "../../hooks/use-workout-session-notification";

export const InProgressWorkoutExercisesScreen = () => {
  const router = useRouter();
  const { page } =
    useLocalSearchParams<InProgressWorkoutExercisesScreenParams>();

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const workoutExerciseIds = useAppSelector(
    (s) =>
      s.workoutSession?.activeWorkout?.workoutExercises
        ?.slice()
        ?.sort((a, b) => a.order - b.order)
        ?.map((we) => we.id),
    shallowEqual
  );

  const [activePage, setActivePage] = useState(Number(page));

  return (
    <AppScreen name="in-progress-workout-exercises-screen">
      <Header />
      <View className="mb-3">
        <PagerDots
          activePage={activePage}
          pages={workoutExerciseIds?.length || 0}
        />
      </View>
      <Divider />

      <PagerView
        style={{ flex: 1 }}
        initialPage={activePage}
        onPageSelected={(e) => {
          setActivePage(e.nativeEvent.position);
        }}
      >
        {workoutExerciseIds?.map((workoutExerciseId, index) => (
          <WorkoutExercisePage
            key={index.toString()}
            index={index}
            workoutExerciseId={workoutExerciseId}
          />
        ))}
      </PagerView>

      <RestTimeCountDown />
    </AppScreen>
  );
};

const WorkoutExercisePage = React.memo(
  ({
    index,
    workoutExerciseId,
  }: {
    index: number;
    workoutExerciseId: string;
  }) => {
    const insets = useSafeAreaInsets();
    const modalRef = useRef<BottomSheetModal>(null);
    const historyRef = useRef<BottomSheetModal>(null);
    // const workoutExercise = useAppSelector((s) =>
    //   s.workoutSession?.activeWorkout?.workoutExercises?.find(
    //     (we) => we.id === workoutExerciseId
    //   )
    // );
    // const workoutExercise = useAppSelector(
    //   makeSelectWorkoutExerciseById(workoutExerciseId)
    // );
    const exerciseSetIds = useAppSelector(
      (s) =>
        s.workoutSession?.activeWorkout?.workoutExercises
          ?.find((we) => we.id === workoutExerciseId)
          ?.sets?.map((es) => es.id),
      shallowEqual
    );
    if (!exerciseSetIds) return null;
    return (
      <View key={index.toString()} className="flex-1">
        <FlatList
          keyExtractor={(item) => item}
          data={exerciseSetIds}
          renderItem={({ item, index }) => (
            <ExerciseSetItem
              exerciseSetId={item}
              index={index}
              workoutExerciseId={workoutExerciseId}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: insets.bottom + 60,
          }}
          style={{ flex: 1 }}
          ListHeaderComponent={
            <Fragment>
              <ExerciseHeader workoutExerciseId={workoutExerciseId} />
              <View className="my-2">
                <HistoryAndNotes
                  noteRef={modalRef}
                  historyRef={historyRef}
                  workoutExerciseId={workoutExerciseId}
                />
              </View>
            </Fragment>
          }
          ItemSeparatorComponent={() => <View className="my-2" />}
        />
        <AddNotesToWorkoutExerciseSheet
          modalRef={modalRef}
          workoutExerciseId={workoutExerciseId}
        />
      </View>
    );
  }
);

const PagerDots = React.memo(
  ({
    activePage,
    pages,
  }: {
    activePage: number;
    pages: number;
  }) => {
    return (
      <View className="flex-row items-center justify-center gap-x-2">
        {Array.from({ length: pages }).map((_, index) => (
          <View
            key={index.toString()}
            className={`w-2 h-2 rounded-full ${
              index === activePage ? "bg-primary" : "bg-gray-500"
            }`}
          />
        ))}
      </View>
    );
  }
);

const ExerciseHeader = ({
  workoutExerciseId,
}: {
  workoutExerciseId: string;
}) => {
  const name = useAppSelector(
    (s) =>
      s.workoutSession?.activeWorkout?.workoutExercises?.find(
        (we) => we.id === workoutExerciseId
      )?.exercise?.translations?.[0]?.name
  );
  const image = useAppSelector(
    (s) =>
      s.workoutSession?.activeWorkout?.workoutExercises?.find(
        (we) => we.id === workoutExerciseId
      )?.exercise?.images?.[0]
  );
  return (
    <View className="flex-row items-center gap-4">
      <View>
        <Image
          source={image}
          style={{ width: 80, height: 80, borderRadius: 10 }}
        />
      </View>
      <View>
        <AppText className="text-xl">{name}</AppText>
      </View>
    </View>
  );
};

const HistoryAndNotes = ({
  noteRef,
  historyRef,
  workoutExerciseId,
}: {
  noteRef: React.RefObject<BottomSheetModal>;
  historyRef: React.RefObject<BottomSheetModal>;
  workoutExerciseId: string;
}) => {
  const { t } = useTranslation();
  const debouncedPress = usePreventRepeatPress();
  const notes = useAppSelector(
    (s) =>
      s.workoutSession?.activeWorkout?.workoutExercises?.find(
        (we) => we.id === workoutExerciseId
      )?.notes
  );

  return (
    <View className="flex-row items-center gap-x-4">
      <TouchableOpacity
        className="flex-1 border border-gray-500 rounded-3xl p-2"
        hitSlop={10}
        onPress={() => {
          debouncedPress(() => {
            historyRef.current?.present();
          });
        }}
      >
        <AppText className="text-center">{t("history")}</AppText>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 border border-gray-500 rounded-3xl p-2"
        hitSlop={10}
        onPress={() => {
          debouncedPress(() => {
            noteRef.current?.present();
          });
        }}
      >
        <View className="flex-row items-center gap-x-2 justify-center">
          {!!notes && <View className="w-2 h-2 rounded-full bg-primary" />}
          <AppText className="text-center">{t("notes")}</AppText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ExerciseSetItem = ({
  exerciseSetId,
  index,
  workoutExerciseId,
}: {
  exerciseSetId: string;
  index: number;
  workoutExerciseId: string;
}) => {
  const exerciseSet = useAppSelector(
    (s) =>
      s.workoutSession?.activeWorkout?.workoutExercises
        ?.find((we) => we.id === workoutExerciseId)
        ?.sets?.find((es) => es.id === exerciseSetId),
    shallowEqual
  );

  if (!exerciseSet) return null;

  if (exerciseSet?.isCompleted) {
    return (
      <CompletedSetItem
        exerciseSet={exerciseSet}
        index={index}
        workoutExerciseId={workoutExerciseId}
      />
    );
  }
  return (
    <UncompletedSetItem
      exerciseSet={exerciseSet}
      index={index}
      workoutExerciseId={workoutExerciseId}
    />
  );
};

const CompletedSetItem = ({
  exerciseSet,
  index,
  workoutExerciseId,
}: {
  exerciseSet: ExerciseSet;
  index: number;
  workoutExerciseId: string;
}) => {
  const { t } = useTranslation();
  const weightUnit = useAppSelector((s) => s.app.weightUnit);
  const debouncedPress = usePreventRepeatPress();

  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((s) => s.app.theme);
  const dispatch = useAppDispatch();

  function onPressMore() {
    const options = [capitalize(t("edit")), t("delete"), t("cancel")];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        showSeparators: true,
        destructiveButtonIndex: 1,
        //   disabledButtonIndices: [Number(workouts?.length) === 1 ? 0 : -1],
        icons: [
          <EditIcon key="edit" />,
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
          // edit
          dispatch(
            undoCompleteActiveWorkoutSessionExerciseSet({
              workoutExerciseId,
              exerciseSetId: exerciseSet.id,
            })
          );
        }
        if (selectedIndex === 1) {
          // delete
          dispatch(
            deleteActiveWorkoutSessionExerciseSet({
              workoutExerciseId,
              exerciseSetId: exerciseSet.id,
            })
          );
        }
      }
    );
  }

  return (
    <View className="rounded-xl overflow-hidden">
      <View className="flex-row items-center py-4 px-4 bg-slate-600">
        <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
          <AppText className="text-black dark:text-black text-xl">
            {index + 1}
          </AppText>
        </View>

        <AppText className="text-xl ml-4">
          {exerciseSet?.weight} {weightUnit} x {exerciseSet?.repetitions}{" "}
          {t("reps")}
        </AppText>

        <TouchableOpacity
          hitSlop={10}
          onPress={() => debouncedPress(() => onPressMore())}
          className="absolute right-3"
        >
          <VerticalDotsIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UncompletedSetItem = ({
  exerciseSet,
  index,
  workoutExerciseId,
}: {
  exerciseSet: ExerciseSet;
  index: number;
  workoutExerciseId: string;
}) => {
  const { t } = useTranslation();
  const debouncedPress = usePreventRepeatPress();
  const weightUnit = useAppSelector((s) => s.app.weightUnit);
  const weightIncrement = useAppSelector((s) => s.app.weightIncrement);
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((s) => s.app.theme);
  const { notifyRestTime } = useWorkoutSessionNotification();
  // const [weight, setWeight] = useState(0);
  // const [reps, setReps] = useState(0);
  // const weight = useAppSelector((s) => s.workoutSession.activeWorkout?.weight);
  // const reps = useAppSelector((s) => s.workoutSession.activeWorkout?.reps);

  function onPressMore() {
    const options = [t("delete"), t("cancel")];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        showSeparators: true,
        destructiveButtonIndex: 0,
        //   disabledButtonIndices: [Number(workouts?.length) === 1 ? 0 : -1],
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
          // delete
          dispatch(
            deleteActiveWorkoutSessionExerciseSet({
              workoutExerciseId,
              exerciseSetId: exerciseSet.id,
            })
          );
        }
      }
    );
  }

  function descrease() {
    dispatch(
      decreaseExerciseSetValue({
        workoutExerciseId,
        exerciseSetId: exerciseSet.id,
        type: "weight",
        value: weightIncrement,
      })
    );
  }

  function increase() {
    dispatch(
      increaseExerciseSetValue({
        workoutExerciseId,
        exerciseSetId: exerciseSet.id,
        type: "weight",
        value: weightIncrement,
      })
    );
  }

  return (
    <View className="rounded-xl overflow-hidden bg-slate-700">
      <View className="flex-row items-center justify-center py-4 bg-slate-600">
        <AppText>
          {capitalize(t("set"))} {index + 1} - {t("rest_time")}:{" "}
          {convertToHourMinuteSecond(exerciseSet?.restTime || 0)}
        </AppText>
        <TouchableOpacity
          hitSlop={10}
          onPress={() => {
            debouncedPress(() => onPressMore());
          }}
          className="absolute right-3"
        >
          <VerticalDotsIcon />
        </TouchableOpacity>
      </View>
      <View className="py-5">
        <AppText className="text-lg text-center mb-3">
          {t("weight")} ({weightUnit})
        </AppText>

        <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity hitSlop={10} onPress={descrease}>
            <MinusCircleIcon />
          </TouchableOpacity>

          <View className="gap-y-4">
            <AppText className="text-4xl text-center">
              {exerciseSet?.weight ? exerciseSet?.weight : ""}
            </AppText>
          </View>

          <TouchableOpacity hitSlop={10} onPress={increase}>
            <PlusCircleIcon />
          </TouchableOpacity>
        </View>
      </View>

      <Divider className="bg-slate-300" />

      <View className="py-5">
        <AppText className="text-lg text-center mb-3">{t("reps")}</AppText>

        <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity
            hitSlop={10}
            onPress={() => {
              dispatch(
                decreaseExerciseSetValue({
                  workoutExerciseId,
                  exerciseSetId: exerciseSet.id,
                  type: "repetitions",
                  value: 1,
                })
              );
            }}
          >
            <MinusCircleIcon />
          </TouchableOpacity>

          <View className="gap-y-4">
            <AppText className="text-4xl text-center">
              {exerciseSet?.repetitions ? exerciseSet?.repetitions : ""}
            </AppText>
          </View>

          <TouchableOpacity
            hitSlop={10}
            onPress={() => {
              dispatch(
                increaseExerciseSetValue({
                  workoutExerciseId,
                  exerciseSetId: exerciseSet.id,
                  type: "repetitions",
                  value: 1,
                })
              );
            }}
          >
            <PlusCircleIcon />
          </TouchableOpacity>
        </View>
      </View>

      <AppButton
        color="primary"
        title={t("complete_set")}
        onPress={() => {
          debouncedPress(async () => {
            if (!exerciseSet.weight || !exerciseSet.repetitions) {
              toast.error(t("please_fill_all_fields"), {
                position: "bottom-center",
              });
              return;
            }

            dispatch(
              completeActiveWorkoutSessionExerciseSet({
                workoutExerciseId,
                exerciseSetId: exerciseSet.id,
              })
            );

            dispatch(
              setCountDownRestTimeEndTime({
                restTime: exerciseSet?.restTime || 0,
              })
            );

            notifyRestTime(exerciseSet?.restTime || 0);
          });
        }}
      />
    </View>
  );
};

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
    (s) => s.workoutSession.countdownRestTimeEndTime
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
  const { t } = useTranslation();
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
      <TouchableOpacity hitSlop={10} className="absolute right-0">
        <AppText>{t("finish")}</AppText>
      </TouchableOpacity>
    </View>
  );
});
