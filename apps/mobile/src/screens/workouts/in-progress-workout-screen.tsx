import { TouchableOpacity, View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { useRouter } from "expo-router";
import { useWorkoutTimer } from "../../hooks/use-workout-timer";
import { AppText } from "../../components/ui/app-text";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import {
  CancelIcon,
  ChevronLeftIcon,
  DeleteIcon,
  ReplaceIcon,
  VerticalDotsIcon,
} from "../../components/ui/expo-icon";
import { Divider } from "../../components/ui/divider";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
  finishWorkoutSession,
  removeActiveWorkoutSessionExercise,
  reorderActiveWorkoutSessionExercises,
} from "../../stores/slices/workout-session-slice";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "../../styles/themes";
import { appRoutes } from "../../configs/routes";
import { AppButton } from "../../components/ui/app-button";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";
import React, { useEffect, useRef } from "react";
import deepEqual from "deep-equal";
import { useWorkoutSessionNotification } from "../../hooks/use-workout-session-notification";
import { WorkoutExerciseItem } from "../../components/workout-exercise-item";
import { AppTouchable } from "../../components/ui/app-touchable";
import { EditSessionExerciseSheet } from "../../components/bottom-sheets/edit-session-exercise-sheet";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  cloneExercises,
  resetEditExerciseSet,
  selectExercisesForList,
  setSelectedExerciseId,
} from "../../stores/slices/edit-exercise-set.slice";

type ExerciseListItem = ReturnType<typeof selectExercisesForList>[number];

export const InProgressWorkoutScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const debouncedPress = usePreventRepeatPress();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((s) => s.app.theme);
  const sheetRef = useRef<BottomSheet>(null);
  const selectedExerciseId = useAppSelector(
    (s) => s.editExerciseSet.selectedExerciseId
  );
  const activeWorkout = useAppSelector((s) => s.workoutSession.activeWorkout);

  useEffect(() => {
    if (!activeWorkout) return;
    dispatch(
      cloneExercises(
        activeWorkout.workoutExercises?.map((e, index) => ({
          id: e.id,
          name: e.exercise?.translations?.[0]?.name || "",
          order: e.order,
          sets:
            e.sets?.map((e) => ({
              id: e.id,
              isCompleted: false,
              weight: 0,
              repetitions: 0,
              distance: 0,
              duration: 0,
              order: index,
              originalExerciseId: e.workoutExerciseId,
              exerciseNameSnapshot: "ss",
              type: "untouched",
            })) || [],
        })) || []
      )
    );
    return () => {
      dispatch(resetEditExerciseSet());
    };
  }, [activeWorkout, dispatch]);

  const workoutExercises = useAppSelector(selectExercisesForList, deepEqual);

  function onPressMore(workoutExerciseId: string) {
    const options = [t("replace"), t("delete"), t("cancel")];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        showSeparators: true,
        destructiveButtonIndex: 1,

        icons: [
          <ReplaceIcon key="replace" size={20} />,
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
          // replace
          router.push(
            appRoutes.exercises.list({
              replaceWorkoutExerciseId: workoutExerciseId,
              allowSelect: "true",
              mode: "replaceToActiveWorkoutSession",
            })
          );
        }

        if (selectedIndex === 1) {
          // delete
          dispatch(
            removeActiveWorkoutSessionExercise({
              workoutExerciseId: workoutExerciseId,
            })
          );
        }
      }
    );
  }

  const renderItem = (params: RenderItemParams<ExerciseListItem>) => {
    return (
      <ScaleDecorator>
        <ExerciseItem
          {...params}
          onPressMore={(item) => {
            dispatch(setSelectedExerciseId(item.id));
            sheetRef.current?.expand();
          }}
        />
      </ScaleDecorator>
    );
  };

  return (
    <AppScreen name="in-progress-workout-screen">
      <Header />
      <Divider />

      <DraggableFlatList
        keyExtractor={(item) => item.id}
        data={workoutExercises || []}
        renderItem={renderItem}
        style={{ flex: 1 }}
        containerStyle={{ flexGrow: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        onDragEnd={({ data }) => {
          dispatch(
            reorderActiveWorkoutSessionExercises(
              data.map((e, i) => ({
                id: e.id,
                order: i,
              }))
            )
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
      <EditSessionExerciseSheet
        modalRef={sheetRef}
        onDeleteItem={() => {
          if (!selectedExerciseId) return;
          dispatch(
            removeActiveWorkoutSessionExercise({
              workoutExerciseId: selectedExerciseId,
            })
          );
        }}
        onReplaceItem={() => {
          if (!selectedExerciseId) return;
          router.push(
            appRoutes.exercises.list({
              replaceWorkoutExerciseId: selectedExerciseId,
              allowSelect: "true",
              mode: "replaceToActiveWorkoutSession",
            })
          );
          // toast.info(t("wip"), {
          //   position: "bottom-center",
          // });
        }}
      />
    </AppScreen>
  );
};

const Header = React.memo(() => {
  const router = useRouter();
  const { t } = useTranslation();
  const debouncedPress = usePreventRepeatPress();
  const dispatch = useAppDispatch();
  const { cancelRestTimeNotification } = useWorkoutSessionNotification();
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
      <TouchableOpacity
        hitSlop={10}
        className="absolute right-0"
        onPress={() =>
          debouncedPress(() => {
            cancelRestTimeNotification();
            dispatch(finishWorkoutSession());
            router.back();
          })
        }
      >
        <AppText>{t("finish")}</AppText>
      </TouchableOpacity>
    </View>
  );
});

const CountDown = React.memo(() => {
  const { formattedTime } = useWorkoutTimer();
  return (
    <AppText className="text-lg font-bold self-center">{formattedTime}</AppText>
  );
});

const ExerciseItem = ({
  item,
  drag,
  getIndex,
  onPressMore,
}: RenderItemParams<ExerciseListItem> & {
  onPressMore: (item: ExerciseListItem) => void;
}) => {
  const router = useRouter();
  const pageIndex = getIndex();

  return (
    <WorkoutExerciseItem
      index={(pageIndex || 0) + 1}
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
        if (pageIndex === undefined) return;
        router.navigate(
          appRoutes.inProgress.workoutExercises({
            pageIndex: pageIndex.toString(),
          })
        );
      }}
      onLongPress={drag}
    />
  );
};
