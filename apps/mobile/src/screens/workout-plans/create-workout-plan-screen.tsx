import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import PagerView, {
  PagerViewOnPageSelectedEventData,
} from "react-native-pager-view";
import { useCallback, useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { usePagerView } from "../../hooks/use-pager-view";
import { delay } from "lodash";
import { useModal } from "react-native-modalfy";
import { AppButton } from "../../components/ui/app-button";
import {
  store,
  useAppDispatch,
  useAppSelector,
} from "../../stores/redux-store";
import {
  addWorkout,
  InitialWorkoutPlan,
  initWorkoutPlan,
  overrideWorkoutExercises,
  removeWorkout,
  removeWorkoutExercise,
  resetCreateWorkoutPlan,
  selectWorkoutTemplateById,
  selectWorkoutTemplateIds,
  updateActiveWorkoutIndex,
  updateWorkoutName,
  updateWorkoutPlanImage,
  updateWorkoutPlanName,
} from "../../stores/slices/create-workout-plan-slice";
import { appRoutes } from "app-config";
import {
  queryClient,
  useCreateWorkoutPlan,
  useGetWorkoutPlan,
  useUpdateWorkoutPlan,
  WorkoutPlan,
} from "app";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { colors } from "../../styles/themes";
import { useDispatch } from "react-redux";
import { workoutPlanKeys } from "app/src/query/workout-plans/workout-plans.keys";
import {
  CreateWorkoutPlanBodySchema,
  UpdateWorkoutPlanBodySchema,
} from "app-config";
import { useIsMutating } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { AppImage } from "../../components/ui/app-image";
import { AppTouchable } from "../../components/ui/app-touchable";
import ReorderableList, {
  useReorderableDrag,
} from "react-native-reorderable-list";
import deepEqual from "deep-equal";

export const CreateWorkoutPlanScreen = () => {
  const { workoutPlanId } = useLocalSearchParams<{ workoutPlanId?: string }>();
  const { data: editingWorkoutPlan } = useGetWorkoutPlan(workoutPlanId);

  useEffect(() => {
    if (!editingWorkoutPlan) return;
    dispatch(
      initWorkoutPlan({
        workoutPlan: {
          name: editingWorkoutPlan.name || "",
          cover_image: editingWorkoutPlan?.cover_image || "",
          workoutTemplates: [],
          // workoutTemplates:
          //   editingWorkoutPlan.workoutTemplates?.map((workout) => ({
          //     id: workout.id,
          //     name: workout.name || "",
          //     order: workout.order || 0,

          //     templateExercises:
          //       workout.templateExercises?.map((workoutExercise) => ({
          //         id: workoutExercise.id,
          //         exercise: workoutExercise.exercise,
          //         order: workoutExercise.order || 0,
          //         templateSets: workoutExercise.targetSets || [],
          //       })) || [],
          //   })) || [],
        },
      })
    );
  }, [editingWorkoutPlan]);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const { showActionSheetWithOptions } = useActionSheet();
  // const theme = useAppSelector((state) => state.app.theme);
  // const workoutTemplates = useAppSelector(
  //   (state) => state.createWorkoutPlan.workoutPlan.workoutTemplates
  // );
  const workoutTemplateIds = useAppSelector(
    selectWorkoutTemplateIds,
    deepEqual
  );
  const handlePageSelected = useCallback(
    (e: NativeSyntheticEvent<PagerViewOnPageSelectedEventData>) => {
      dispatch(
        updateActiveWorkoutIndex({ workoutIndex: e.nativeEvent.position })
      );
    },
    [dispatch]
  );
  const activeWorkoutIndex = useAppSelector(
    (state) => state.createWorkoutPlan.activeWorkoutIndex
  );

  const { ref, setPage } = usePagerView(1);
  // const { openModal } = useModal();
  // const router = useRouter();
  const isMutating = useIsMutating();

  // const debouncedPress = usePreventRepeatPress();

  useEffect(() => {
    return () => {
      dispatch(resetCreateWorkoutPlan());
    };
  }, [dispatch]);

  // function onPressMore(workoutId: string) {
  //   const options = [t("reorder"), t("duplicate"), t("delete"), t("cancel")];

  //   showActionSheetWithOptions(
  //     {
  //       options,
  //       cancelButtonIndex: options.length - 1,
  //       showSeparators: true,
  //       destructiveButtonIndex: 2,
  //       disabledButtonIndices: [
  //         Number(workoutTemplates?.length) === 1 ? 0 : -1,
  //       ],
  //       icons: [
  //         <ReorderIcon key="reorder" size={20} />,
  //         <DuplicateIcon key="duplicate" size={20} />,
  //         <DeleteIcon key="delete" color="red" size={20} />,
  //         <CancelIcon key="cancel" size={20} />,
  //       ],
  //       textStyle: {
  //         fontSize: 18,
  //         fontWeight: "500",
  //         color: theme === "dark" ? "white" : "black",
  //       },

  //       containerStyle: {
  //         backgroundColor:
  //           theme === "dark"
  //             ? colors.pageBackground.dark
  //             : colors.pageBackground.light,
  //       },
  //     },
  //     (selectedIndex) => {
  //       if (selectedIndex === 0) {
  //         // reorder
  //         router.push(appRoutes.workoutPlans.editWorkoutOrder());
  //       }
  //       if (selectedIndex === 1) {
  //         // duplicate
  //         dispatch(
  //           duplicateWorkout({
  //             workoutId: workoutTemplates[activeWorkoutIndex].id,
  //           })
  //         );
  //         delay(() => setPage(workoutTemplates.length), 100);
  //       }
  //       if (selectedIndex === 2) {
  //         // delete
  //         openModal("ConfirmModal", {
  //           message: t("delete_workout_plan_message"),
  //           onConfirm: () => {
  //             dispatch(removeWorkout({ workoutId }));
  //           },
  //         });
  //       }
  //     }
  //   );
  // }

  // const renderItem = ({
  //   item,
  //   workoutId,
  // }: {
  //   item: InitialWorkoutPlan["workoutTemplates"][number]["templateExercises"][number];
  //   workoutId: string;
  // }) => {
  //   return <ExerciseItem item={item} workoutId={workoutId} />;
  // };

  return (
    <AppScreen
      name="create-workout-plan-screen"
      isLoading={isMutating > 0}
      safeAreaEdges={["top"]}
    >
      <Header
        isEditing={!!workoutPlanId}
        editingWorkoutPlan={editingWorkoutPlan}
      />
      <View className="flex-row gap-x-4 px-4">
        <PlanImage />
        <PlanName />
      </View>
      <AddWorkoutTemplateButton />

      <View className="flex-row items-center justify-center gap-x-2 z-50">
        <PagerDots
          pages={workoutTemplateIds.length}
          activePage={activeWorkoutIndex}
        />
      </View>
      <PagerView
        testID="pager-view"
        ref={ref}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {workoutTemplateIds.map((workoutId, workoutIndex) => (
          <List
            key={workoutIndex.toString()}
            workoutIndex={workoutIndex}
            workoutId={workoutId}
          />
        ))}
      </PagerView>
    </AppScreen>
  );
};

const List = ({
  workoutIndex,
  workoutId,
}: {
  workoutIndex: number;
  workoutId: string;
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.app.theme);
  const { t } = useTranslation();
  const debouncedPress = usePreventRepeatPress();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const { openModal } = useModal();
  const workout = useAppSelector(
    (state) => selectWorkoutTemplateById(state, workoutId),
    deepEqual
  );

  function onPressMore(workoutId: string) {
    const options = [t("reorder"), t("duplicate"), t("delete"), t("cancel")];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        showSeparators: true,
        destructiveButtonIndex: 2,
        disabledButtonIndices: [
          // Number(workoutTemplates?.length) === 1 ? 0 : -1,
        ],
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
          // dispatch(
          //   duplicateWorkout({
          //     workoutId: workoutTemplates[activeWorkoutIndex].id,
          //   })
          // );
          // delay(() => setPage(workoutTemplates.length), 100);
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

  const renderItem = useCallback(
    ({
      item,
      workoutId,
    }: {
      item: InitialWorkoutPlan["workoutTemplates"][number]["templateExercises"][number];
      workoutId: string;
    }) => {
      return <ExerciseItem item={item} workoutId={workoutId} />;
    },
    []
  );

  return (
    <ReorderableList
      key={workoutIndex.toString()}
      keyExtractor={(item) => item.id?.toString()}
      data={workout?.templateExercises || []}
      renderItem={({ item }) =>
        renderItem({ item, workoutId: workout?.id || "" })
      }
      panActivateAfterLongPress={520}
      onReorder={({ from, to }) => {
        dispatch(
          overrideWorkoutExercises({
            workoutId: workout?.id || "",
            from,
            to,
          })
        );
      }}
      style={{ flex: 1 }}
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
            <WorkoutTemplateNameInput
              workout={workout}
              workoutIndex={workoutIndex}
            />
          </View>
          <AppTouchable
            className="ml-auto"
            onPress={() => onPressMore(workout?.id || "")}
            testID={`workout-item-more-button-${workoutIndex}`}
          >
            <VerticalDotsIcon color="white" />
          </AppTouchable>
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
                    workoutId: workout?.id || "",
                    mode: "addToCreateWorkoutPlan",
                  })
                );
              });
            }}
          />
        </View>
      )}
    />
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
            testID={`pager-dot-${index}`}
            key={index?.toString()}
            className={cn("w-3 h-3 rounded-full", {
              "bg-primaryDarken w-4 h-4": index === activePage,
              "bg-gray-300": index !== activePage,
            })}
          />
        ))}
    </View>
  );
};

function WorkoutTemplateNameInput({
  workout,
  workoutIndex,
}: {
  workout: InitialWorkoutPlan["workoutTemplates"][number] | undefined;
  workoutIndex: number;
}) {
  // Use local state to track input value
  const [localName, setLocalName] = useState(workout?.name || "");
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Only update Redux on blur (when user finishes typing)
  const handleBlur = () => {
    if (localName !== workout?.name) {
      dispatch(
        updateWorkoutName({
          workoutId: workout?.id || "",
          name: localName,
        })
      );
    }
  };

  return (
    <TextInput
      value={localName}
      onChangeText={setLocalName}
      onBlur={handleBlur}
      // Add these props to improve keyboard behavior
      submitBehavior="submit"
      testID={`workout-name-input-${workoutIndex}`}
      placeholder={t("workout_name")}
      className="text-xl text-white"
      placeholderTextColor={"white"}
    />
  );
}

const ExerciseItem = ({
  item,
  workoutId,
}: {
  item: InitialWorkoutPlan["workoutTemplates"][number]["templateExercises"][number];
  workoutId: string;
}) => {
  const drag = useReorderableDrag();
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
              mode: "replaceToCreateWorkoutPlan",
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
      hitSlop={20}
      delayLongPress={500}
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
        onLongPress={() => {
          drag();
        }}
      />
      <AppImage
        uri={item.exercise.images?.[0]}
        style={{ width: 68, height: 68, borderRadius: 10, marginRight: 4 }}
        contentFit="cover"
      />
      <View className="flex-1 gap-y-1">
        <AppText className="text-lg font-semibold">
          {item.exercise.name}
        </AppText>
        <AppText className="dark:text-gray-300 text-gray-700">
          {t("sets_count", { count: item.templateSets.length })}
        </AppText>
      </View>
      <AppTouchable
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
      </AppTouchable>
    </Pressable>
  );
};

const Header = ({
  isEditing = false,
  editingWorkoutPlan,
}: {
  isEditing: boolean;
  editingWorkoutPlan: WorkoutPlan;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();
  const createWorkoutPlanMutation = useCreateWorkoutPlan();
  const updateWorkoutPlanMutation = useUpdateWorkoutPlan();

  function handleSubmit() {
    const image = store.getState().createWorkoutPlan.workoutPlan.cover_image;
    const name = store.getState().createWorkoutPlan.workoutPlan.name;
    const workoutTemplates =
      store.getState().createWorkoutPlan.workoutPlan.workoutTemplates;

    if (isEditing) {
      const updateBody = {
        id: editingWorkoutPlan.id,
        name,
        cover_image: image || "",
        description: undefined,
        level: editingWorkoutPlan.level || undefined,
        isPublic: editingWorkoutPlan.isPublic || false,
        isPremium: editingWorkoutPlan.isPremium || false,
        isFeatured: editingWorkoutPlan.isFeatured || false,
        isSingle: editingWorkoutPlan.isSingle || false,
        goal: editingWorkoutPlan.goal || undefined,
        workoutTemplates: workoutTemplates.map((workout, index) => ({
          id: workout.id,
          name: workout.name,
          templateExercises: workout.templateExercises.map((exercise) => ({
            id: exercise.id,
            exerciseId: exercise.exercise.id,
            order: exercise.order,
            templateSets: exercise.templateSets,
          })),
          order: index,
        })),
      };

      const result = UpdateWorkoutPlanBodySchema.safeParse(updateBody);
      if (!result.success) {
        console.error("submit error => ", result.error);
        return;
      }
      updateWorkoutPlanMutation.mutate(result.data, {
        onError: (error) => {
          console.error("submit error => ", error);
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: workoutPlanKeys.detail(editingWorkoutPlan.id),
          });
          router.back();
        },
      });
      return;
    }
    const body = {
      name,
      description: undefined,
      cover_image: image || "",
      level: undefined,
      isPublic: false,
      isPremium: false,
      isFeatured: false,
      isSingle: false,
      category: undefined,
      workoutTemplates: workoutTemplates.map((workout, index) => ({
        name: workout.name,
        templateExercises: workout.templateExercises.map((exercise) => ({
          exerciseId: exercise.exercise.id,
          order: exercise.order,
          templateSets: exercise.templateSets,
        })),
        order: index,
      })),
    };
    const result = CreateWorkoutPlanBodySchema.safeParse(body);
    if (!result.success) {
      toast.error(t(result.error.errors[0].message));
      console.error("submit error => ", result.error);
      return;
    }
    createWorkoutPlanMutation.mutate(result.data, {
      onError: (error) => {
        console.error("submit error => ", error);
      },
      onSuccess: (data) => {
        router.back();
      },
    });
  }

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
        {isEditing ? t("edit_workout_plan") : t("create_workout_plan")}
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

const PlanImage = () => {
  const { openModal } = useModal();
  const dispatch = useAppDispatch();
  const image = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan.cover_image
  );

  return (
    <TouchableOpacity
      testID="workout-plan-image-button"
      onPress={() => {
        openModal("TakeOrSelectMediaModal", {
          onComplete: (media) => {
            if (media) {
              dispatch(updateWorkoutPlanImage({ cover_image: media.uri }));
            }
          },
        });
      }}
      className="w-20 h-20 rounded-lg overflow-hidden border border-gray-500"
    >
      <AppImage
        uri={image}
        contentFit="cover"
        style={{ width: "100%", height: "100%" }}
        testID="workout-plan-image"
      />
    </TouchableOpacity>
  );
};

const PlanName = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.app.theme);
  const [isFocused, setIsFocused] = useState(false);
  const name = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan.name
  );
  return (
    <View className="flex-1">
      <AppText className="text-sm text-gray-500 dark:text-gray-400">
        {t("workout_plan_name")} *
      </AppText>
      <TextInput
        placeholder={t("workout_plan_name")}
        className={cn("text-xl text-black dark:text-white", {
          "border-b-2 border-primary": isFocused,
        })}
        placeholderTextColor={theme === "dark" ? "white" : "black"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={name}
        onChangeText={(text) => dispatch(updateWorkoutPlanName({ name: text }))}
      />
    </View>
  );
};

const AddWorkoutTemplateButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { setPage } = usePagerView(1);
  const workoutTemplates = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan.workoutTemplates
  );
  function handleAddWorkout() {
    dispatch(
      addWorkout({
        name: t("workout_name"),
      })
    );
    delay(() => setPage(workoutTemplates.length), 100);
  }
  return (
    <View style={{ zIndex: 100 }}>
      <View className="self-end -top-6 right-4 absolute z-50">
        <AppTouchable
          onPress={() => {
            handleAddWorkout();
          }}
          className="px-4 bg-primary w-16 h-16 rounded-md items-center justify-center z-50"
          testID="add-workout-button"
        >
          <PlusIcon size={30} color="black" pointerEvents="box-only" />
        </AppTouchable>
      </View>
    </View>
  );
};
