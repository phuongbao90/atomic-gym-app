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
import React, { useMemo } from "react";
import { shallowEqual } from "react-redux";
import deepEqual from "deep-equal";
import { useWorkoutSessionNotification } from "../../hooks/use-workout-session-notification";

export const InProgressWorkoutScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const debouncedPress = usePreventRepeatPress();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((s) => s.app.theme);
  const workoutExercises = useAppSelector(
    (s) =>
      s.workoutSession.activeWorkout?.workoutExercises?.map((e) => ({
        id: e.id,
        order: e.order,
      })),
    deepEqual
  );

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

  const renderItem = (
    params: RenderItemParams<{ id: string; order: number }>
  ) => {
    return (
      <ScaleDecorator>
        <ExerciseItem
          {...params}
          onPressMore={onPressMore}
          item={params.item.id}
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
        data={[...(workoutExercises || [])].sort((a, b) => a.order - b.order)}
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
}: RenderItemParams<string> & {
  onPressMore: (item: string) => void;
}) => {
  const workoutExercise = useAppSelector(
    (s) =>
      s.workoutSession.activeWorkout?.workoutExercises?.find(
        (e) => e.id === item
      ),
    shallowEqual
  );
  const completedSetsCount = useMemo(() => {
    return workoutExercise?.sets?.filter((s) => s.isCompleted).length;
  }, [workoutExercise]);
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();
  return (
    <TouchableOpacity
      onLongPress={drag}
      onPress={() => {
        debouncedPress(() => {
          router.push(
            appRoutes.inProgress.workoutExercises({
              workoutId: workoutExercise?.workoutId || "",
              page: getIndex()!.toString(),
            })
          );
        });
      }}
    >
      <View className="flex-row items-center gap-x-4 py-4 pl-2 pr-2 border-b border-gray-500">
        <View className="w-10 h-10 bg-gray-500 rounded-full items-center justify-center">
          <AppText>{getIndex()! + 1}</AppText>
        </View>
        <View>
          <AppText>
            {workoutExercise?.exercise?.translations?.[0]?.name}
          </AppText>
          <AppText>{`${completedSetsCount}/${workoutExercise?.sets?.length} sets completed`}</AppText>
        </View>
        <TouchableOpacity
          className="ml-auto"
          hitSlop={16}
          onPress={() =>
            debouncedPress(() => {
              onPressMore(item);
            })
          }
        >
          <VerticalDotsIcon />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
