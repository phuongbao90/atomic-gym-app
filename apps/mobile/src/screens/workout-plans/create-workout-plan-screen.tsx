import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { AppScreen } from "../../components/ui/app-screen";
import { useRouter } from "expo-router";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";
import { View } from "react-native";
import {
  CancelIcon,
  CheckIcon,
  DeleteIcon,
  DragIcon,
  DuplicateIcon,
  PlusIcon,
  ReorderIcon,
  VerticalDotsIcon,
  XIcon,
} from "../../components/ui/expo-icon";
import { AppText } from "../../components/ui/app-text";
import { Image } from "expo-image";
import PagerView from "react-native-pager-view";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { usePagerView } from "../../hooks/use-pager-view";
import { delay } from "lodash";
import { useModal } from "react-native-modalfy";
import { AppButton } from "../../components/ui/app-button";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import {
  addWorkout,
  CreateWorkoutPlanSliceType,
  duplicateWorkout,
  overrideWorkoutExercises,
  removeWorkout,
  removeWorkoutExercise,
  resetCreateWorkoutPlan,
  updateActiveWorkoutIndex,
  updateWorkoutName,
  updateWorkoutPlanImage,
  updateWorkoutPlanName,
} from "../../stores/slices/create-workout-plan-slice";
import { appRoutes } from "../../configs/routes";
import {
  CreateWorkoutPlanSchema,
  Exercise,
  tryCatch,
  useCreateWorkoutPlan,
} from "app";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "../../styles/themes";
import { ZodError } from "zod";
import { toast } from "sonner-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureEvent } from "react-native-gesture-handler";
// import ReorderableList, {
//   ReorderableListReorderEvent,
//   reorderItems,
//   useReorderableDrag,
// } from "react-native-reorderable-list";

export const CreateWorkoutPlanScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((state) => state.app.theme);
  const image = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan.cover_image
  );
  const name = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan.name
  );
  const workouts = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan.workouts
  );
  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => a.order - b.order);
  }, [workouts]);
  const activeWorkoutIndex = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan.activeWorkoutIndex
  );

  console.log("workouts  ", workouts);
  console.log("sortedWorkouts  ", sortedWorkouts);

  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { ref, setPage } = usePagerView(1);
  const { openModal } = useModal();
  const router = useRouter();
  const createWorkoutPlanMutation = useCreateWorkoutPlan();
  const debouncedPress = usePreventRepeatPress();

  // useEffect(() => {
  //   return () => {
  //     dispatch(resetCreateWorkoutPlan());
  //   };
  // }, [dispatch]);

  function onPressMore(workoutId: string) {
    const options = [t("reorder"), t("duplicate"), t("delete"), t("cancel")];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        showSeparators: true,
        destructiveButtonIndex: 2,
        disabledButtonIndices: [Number(workouts?.length) === 1 ? 0 : -1],
        icons: [
          <ReorderIcon key="reorder" size={20} />,
          <DuplicateIcon key="duplicate" size={20} />,
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
          // reorder
          router.push(appRoutes.workoutPlans.editWorkoutOrder());
        }
        if (selectedIndex === 1) {
          // duplicate
          dispatch(
            duplicateWorkout({ workoutId: workouts[activeWorkoutIndex].id })
          );
          delay(() => setPage(workouts.length), 100);
        }
        if (selectedIndex === 2) {
          // delete
          openModal("ConfirmModal", {
            message: t("delete_workout_plan_message"),
            onConfirm: () => {
              dispatch(removeWorkout({ workoutId }));
            },
          });
        }
      }
    );
  }

  function handleSubmit() {
    const body = {
      name,
      description: undefined,
      cover_image: image?.uri || "",
      level: undefined,
      isPublic: false,
      isPremium: false,
      isFeatured: false,
      isSingle: false,
      category: undefined,
      workouts: workouts.map((workout, index) => ({
        name: workout.name,
        workoutExercises: workout.workoutExercises,
        order: index,
      })),
    };
    const result = tryCatch(() => CreateWorkoutPlanSchema.parse(body));
    if (result.error) {
      const errorMsgs = (result.error as ZodError).issues.map(
        (issue) => issue.message
      );

      toast.error(errorMsgs.join("\n"));
      return;
    }

    // createWorkoutPlanMutation.mutate(body);
  }

  return (
    <AppScreen
      name="create-workout-plan-screen"
      isLoading={createWorkoutPlanMutation.isPending}
    >
      <Header handleSubmit={handleSubmit} />
      <View className="flex-row gap-x-4 px-4">
        <TouchableOpacity
          testID="workout-plan-image-button"
          onPress={() => {
            openModal("TakeOrSelectMediaModal", {
              onComplete: (media) => {
                if (media) {
                  dispatch(updateWorkoutPlanImage({ cover_image: media }));
                }
              },
            });
          }}
          className="w-20 h-20 rounded-lg overflow-hidden border border-gray-500"
        >
          <Image
            source={image}
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
            testID="workout-plan-image"
          />
        </TouchableOpacity>
        <View className="flex-1">
          <AppText className="text-sm text-gray-500 dark:text-gray-400">
            {t("workout_plan_name")} *
          </AppText>
          <TextInput
            placeholder={t("workout_plan_name")}
            className={cn("text-xl text-white dark:text-white", {
              "border-b-2 border-primary": isFocused,
            })}
            placeholderTextColor={theme === "dark" ? "white" : "black"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={name}
            onChangeText={(text) =>
              dispatch(updateWorkoutPlanName({ name: text }))
            }
          />
        </View>
      </View>
      <View>
        <View className="self-end -top-6 right-4 absolute z-40">
          <TouchableOpacity
            onPress={() => {
              dispatch(
                addWorkout({
                  name: t("workout_name"),
                })
              );
              delay(() => setPage(workouts.length), 100);
            }}
            className="px-4 bg-primary w-16 h-16 rounded-md items-center justify-center z-50"
            testID="add-workout-button"
          >
            <PlusIcon size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row items-center justify-center gap-x-2 z-50">
        <PagerDots pages={workouts.length} activePage={activeWorkoutIndex} />
      </View>
      <PagerView
        testID="pager-view"
        ref={ref}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => {
          dispatch(
            updateActiveWorkoutIndex({ workoutIndex: e.nativeEvent.position })
          );
        }}
      >
        {sortedWorkouts.map((workout, workoutIndex) => (
          <DraggableFlatList
            // key={workout.id}
            key={workoutIndex.toString()}
            keyExtractor={(item) => item.id?.toString()}
            // data={workout.workoutExercises}
            data={[...workout.workoutExercises].sort(
              (a, b) => a.order - b.order
            )}
            renderItem={({ item, drag }) => {
              return (
                <ScaleDecorator>
                  <ExerciseItem
                    item={item}
                    workoutId={workout.id}
                    drag={drag}
                  />
                </ScaleDecorator>
              );
            }}
            pagingEnabled={true}
            onDragBegin={() => {
              setIsDragging(true);
            }}
            onDragEnd={({ data }) => {
              setIsDragging(false);
              dispatch(
                overrideWorkoutExercises({
                  workoutId: workout.id,
                  workoutExercises: data,
                })
              );
            }}
            activationDistance={isDragging ? 1 : 20}
            style={{ flex: 1 }}
            containerStyle={{ flexGrow: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              padding: 8,
              backgroundColor:
                theme === "dark"
                  ? colors.pageBackground.dark
                  : colors.pageBackground.light,
            }}
            ListHeaderComponent={() => (
              <View className="flex-row px-2 py-6 items-center bg-slate-500">
                <AppText className="bg-primary text-black dark:text-black rounded-2xl px-3 py-2">
                  {t("day", { count: workoutIndex + 1 })}
                </AppText>
                <View className="ml-4">
                  <TextInput
                    placeholder={t("workout_name")}
                    className="text-xl text-white"
                    placeholderTextColor={"white"}
                    value={workout?.name || ""}
                    onChangeText={(text) =>
                      dispatch(
                        updateWorkoutName({ workoutId: workout.id, name: text })
                      )
                    }
                  />
                </View>
                <TouchableOpacity
                  className="ml-auto"
                  hitSlop={10}
                  onPress={() => onPressMore(workout.id)}
                  testID={`workout-item-more-button-${workoutIndex}`}
                >
                  <VerticalDotsIcon color="white" />
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponentStyle={{
              flexGrow: 1,
            }}
            ListFooterComponent={() => (
              <View className="flex-1 justify-end">
                <AppButton
                  testID={`add-exercise-button-${workoutIndex}`}
                  title={t("add_exercise")}
                  radius="none"
                  color="primary"
                  size="lg"
                  onPress={() => {
                    debouncedPress(() => {
                      router.push(
                        appRoutes.exercises.list({
                          allowSelect: "true",
                          workoutId: workout.id,
                        })
                      );
                    });
                  }}
                />
              </View>
            )}
          />
        ))}
      </PagerView>
    </AppScreen>
  );
};

const PagerDots = ({
  pages,
  activePage,
}: { pages: number; activePage: number }) => {
  return (
    <View className="flex-row gap-x-2 items-center">
      {Array(pages)
        .fill(undefined)
        .map((_, index) => (
          <View
            key={index?.toString()}
            className={cn("w-3 h-3 rounded-full", {
              "bg-primaryDarken w-4 h-4": index === activePage,
              "bg-gray-300": index !== activePage,
            })}
            testID={`pager-dot-${index}`}
          >
            {/* <AppText>{index}</AppText> */}
          </View>
        ))}
    </View>
  );
};

const ExerciseItem = ({
  item,
  workoutId,
  drag,
}: {
  item: CreateWorkoutPlanSliceType["workouts"][number]["workoutExercises"][number];
  workoutId: string;
  drag: (gesture?: GestureEvent<any>) => void;
}) => {
  const { t } = useTranslation();
  const debouncedPress = usePreventRepeatPress();
  const { showActionSheetWithOptions } = useActionSheet();
  const theme = useAppSelector((state) => state.app.theme);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function onPressMore() {
    const options = [t("replace"), t("delete"), t("cancel")];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        showSeparators: true,
        destructiveButtonIndex: 1,
        icons: [
          <MaterialIcons
            key="replace"
            name="find-replace"
            size={20}
            color={theme === "dark" ? "white" : "black"}
          />,
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
              allowSelect: "true",
              workoutId,
              replaceWorkoutExerciseId: item.id,
            })
          );
        }
        if (selectedIndex === 1) {
          // delete
          dispatch(
            removeWorkoutExercise({
              workoutId: workoutId,
              workoutExerciseId: item.id,
            })
          );
        }
      }
    );
  }

  return (
    <Pressable
      className="flex-row items-center gap-x-2 py-4 pl-1 pr-2 border-b border-gray-500"
      testID={`exercise-item-${workoutId}-${item.id}`}
      onPress={() => {
        router.push(
          appRoutes.workoutPlans.editExerciseSets({
            workoutId,
            workoutExerciseId: item.id,
          })
        );
      }}
    >
      <DragIcon
        size={28}
        color="white"
        onLongPress={() => {
          drag();
        }}
      />
      <View className="flex-1 gap-y-1">
        <AppText className="text-white text-lg font-semibold">
          {item.exercise.translations?.[0]?.name}
        </AppText>
        <AppText className="text-gray-300">
          {t("sets_count", { count: item.sets.length })}
        </AppText>
      </View>
      <TouchableOpacity
        className="ml-auto"
        onPress={() =>
          debouncedPress(() => {
            onPressMore();
          })
        }
        hitSlop={10}
        testID={`exercise-item-more-button-${workoutId}-${item.id}`}
      >
        <VerticalDotsIcon color="white" />
      </TouchableOpacity>
    </Pressable>
  );
};

const Header = ({
  handleSubmit,
}: {
  handleSubmit: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();

  return (
    <View className="flex-row gap-x-6 px-4 py-4 items-center">
      <TouchableOpacity
        hitSlop={10}
        onPress={() =>
          debouncedPress(() => {
            router.back();
          })
        }
        testID="back-button"
      >
        <XIcon size={30} />
      </TouchableOpacity>
      <AppText className="text-2xl font-bold">
        {t("create_workout_plan")}
      </AppText>
      <TouchableOpacity
        testID="save-button"
        onPress={() => {
          debouncedPress(() => {
            handleSubmit();
          });
        }}
        className="ml-auto"
      >
        <CheckIcon size={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    marginTop: 14,
  },
});
