import { FlatList, View } from "react-native";
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
} from "../../components/ui/expo-icon";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { AppText } from "../../components/ui/app-text";
import { Divider } from "../../components/ui/divider";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";
import { useTranslation } from "react-i18next";
import { useWorkoutTimer } from "../../hooks/use-workout-timer";
import PagerView from "react-native-pager-view";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { InProgressWorkoutExercisesScreenParams } from "../../configs/routes";
import { Fragment, useState } from "react";
import { ExerciseSet, WorkoutExercise } from "app";
import { Image } from "expo-image";
import {
  completeActiveWorkoutSessionExerciseSet,
  decreaseExerciseSetValue,
  deleteActiveWorkoutSessionExerciseSet,
  increaseExerciseSetValue,
  removeActiveWorkoutSessionExercise,
  undoCompleteActiveWorkoutSessionExerciseSet,
} from "../../stores/slices/workout-session-slice";
import { capitalize } from "lodash";
import { AppButton } from "../../components/ui/app-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "../../styles/themes";

export const InProgressWorkoutExercisesScreen = () => {
  const router = useRouter();
  const { page, workoutId } =
    useLocalSearchParams<InProgressWorkoutExercisesScreenParams>();
  const debouncedPress = usePreventRepeatPress();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const workoutExercises = useAppSelector(
    (s) => s.workoutSession.activeWorkout?.workoutExercises
  );
  const [activePage, setActivePage] = useState(Number(page));

  return (
    <AppScreen name="in-progress-workout-exercises-screen">
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
      <View className="mb-3">
        <PagerDots
          activePage={activePage}
          pages={workoutExercises?.length || 0}
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
        {workoutExercises?.map((weItem, index) => (
          <View key={index.toString()} className="flex-1">
            <FlatList
              data={weItem.sets}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <ExerciseSetItem
                  exerciseSet={item}
                  index={index}
                  workoutExerciseId={weItem.id}
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
                  <ExerciseHeader item={weItem} />
                  <View className="my-2">
                    <HistoryAndNotes />
                  </View>
                </Fragment>
              }
              ItemSeparatorComponent={() => <View className="my-2" />}
            />
          </View>
        ))}
      </PagerView>
    </AppScreen>
  );
};

const PagerDots = ({
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
};

const ExerciseHeader = ({
  item,
}: {
  item: WorkoutExercise;
}) => {
  return (
    <View className="flex-row items-center gap-4">
      <View>
        <Image
          source={item.exercise?.images?.[0]}
          style={{ width: 80, height: 80, borderRadius: 10 }}
        />
      </View>
      <View>
        <AppText className="text-xl">
          {item.exercise?.translations?.[0]?.name}
        </AppText>
      </View>
    </View>
  );
};

const HistoryAndNotes = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();
  return (
    <View className="flex-row items-center gap-x-4">
      <TouchableOpacity
        className="flex-1 border border-gray-500 rounded-3xl p-2"
        hitSlop={10}
        onPress={() => {
          debouncedPress(() => {});
        }}
      >
        <AppText className="text-center">{t("history")}</AppText>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 border border-gray-500 rounded-3xl p-2"
        hitSlop={10}
        onPress={() => {
          debouncedPress(() => {});
        }}
      >
        <AppText className="text-center">{t("notes")}</AppText>
      </TouchableOpacity>
    </View>
  );
};

const ExerciseSetItem = ({
  exerciseSet,
  index,
  workoutExerciseId,
}: {
  exerciseSet: ExerciseSet;
  index: number;
  workoutExerciseId: string;
}) => {
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
          {capitalize(t("set"))} {index + 1}
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
          debouncedPress(() => {
            dispatch(
              completeActiveWorkoutSessionExerciseSet({
                workoutExerciseId,
                exerciseSetId: exerciseSet.id,
                // weight,
                // reps,
              })
            );
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
