import { TouchableOpacity, View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { useRouter } from "expo-router";
import { WorkoutExercise } from "app";
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
  removeActiveWorkoutSessionExercise,
  reorderActiveWorkoutSessionExercises,
} from "../../stores/slices/workout-session-slice";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "../../styles/themes";
import { appRoutes } from "../../configs/routes";
import { AppButton } from "../../components/ui/app-button";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";
import workout from "../../../app/(app)/in-progress/workout";

export const InProgressWorkoutScreen = () => {
  const { t } = useTranslation();
  const workout = useAppSelector((s) => s.workoutSession.activeWorkout);
  const dispatch = useAppDispatch();
  // const { formattedTime } = useWorkoutTimer();
  const debouncedPress = usePreventRepeatPress();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((s) => s.app.theme);

  function onPressMore(item: WorkoutExercise) {
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
              replaceWorkoutExerciseId: item.id,
              allowSelect: "true",
              mode: "replaceToActiveWorkoutSession",
            })
          );
        }

        if (selectedIndex === 1) {
          // delete
          dispatch(
            removeActiveWorkoutSessionExercise({
              workoutExerciseId: item.id,
            })
          );
        }
      }
    );
  }

  const renderItem = (params: RenderItemParams<WorkoutExercise>) => {
    return (
      <ScaleDecorator>
        <ExerciseItem {...params} onPressMore={onPressMore} />
      </ScaleDecorator>
    );
  };

  if (!workout || !workout.workoutExercises) return null;

  return (
    <AppScreen name="in-progress-workout-screen">
      <Header />
      <Divider />

      <DraggableFlatList
        keyExtractor={(item) => item.id}
        data={[...workout.workoutExercises].sort((a, b) => a.order - b.order)}
        renderItem={renderItem}
        style={{ flex: 1 }}
        containerStyle={{ flexGrow: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        onDragEnd={({ data }) => {
          dispatch(reorderActiveWorkoutSessionExercises(data));
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

const Header = () => {
  const router = useRouter();
  const { t } = useTranslation();

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
};

const CountDown = () => {
  const { formattedTime } = useWorkoutTimer();
  return (
    <AppText className="text-lg font-bold self-center">{formattedTime}</AppText>
  );
};

const ExerciseItem = ({
  item,
  drag,
  getIndex,
  onPressMore,
}: RenderItemParams<WorkoutExercise> & {
  onPressMore: (item: WorkoutExercise) => void;
}) => {
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();
  return (
    <TouchableOpacity
      onLongPress={drag}
      onPress={() => {
        debouncedPress(() => {
          router.push(
            appRoutes.inProgress.workoutExercises({
              workoutId: item.workoutId || "",
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
          <AppText>{item.exercise?.translations?.[0]?.name}</AppText>
          <AppText>{`0/${item.sets?.length} sets completed`}</AppText>
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
