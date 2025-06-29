import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { capitalize, delay } from "lodash";
import {
  LegendList,
  LegendListRef,
  LegendListRenderItemProps,
} from "@legendapp/list";
import { MuscleGroup, useGetExercises } from "app";
import { useCallback, useMemo, useRef, useState } from "react";
import { AppText } from "../../components/ui/app-text";
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
} from "../../components/ui/expo-icon";
import { ExerciseItem } from "../../components/exercise-item";
import { colors, PRIMARY_COLOR } from "../../styles/themes";
import { useDebounce } from "../../hooks/use-debounce";
import { SelectMuscleGroupSheet } from "../../components/bottom-sheets/select-muscle-group";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { appRoutes, ExercisesScreenParams } from "app-config";
import { router, useLocalSearchParams } from "expo-router";
import { Env } from "../../configs/env";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { Radio } from "../../components/ui/radio";
import {
  addWorkoutExercises,
  replaceExerciseInWorkout,
} from "../../stores/slices/create-workout-plan-slice";
import { useSession } from "../../lib/auth-client";
import { AppTouchable } from "../../components/ui/app-touchable";
import { replaceExercise } from "../../stores/slices/edit-exercise-set-slice";
import { ExerciseItemSchema } from "app-config";
import { z } from "zod";

export const ExercisesScreen = () => {
  const params = useLocalSearchParams<ExercisesScreenParams>();

  let workoutId: string | undefined;
  let replaceWorkoutExerciseId: string | undefined;
  let allowSelect: boolean | undefined;
  if ("workoutId" in params) {
    workoutId = params.workoutId;
  }
  if ("replaceWorkoutExerciseId" in params) {
    replaceWorkoutExerciseId = params.replaceWorkoutExerciseId;
  }
  if ("allowSelect" in params) {
    allowSelect = params.allowSelect === "true";
  }

  const mode = params.mode || "default";

  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const listRef = useRef<LegendListRef | null>(null);
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);
  const debouncedPress = usePreventRepeatPress();
  const muscleGroupModalRef = useRef<BottomSheetModal>(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<MuscleGroup | null>(null);

  const { data: session } = useSession();
  const defaultSets = useAppSelector((state) => state.app.defaultSets);
  const defaultRestTime = useAppSelector((state) => state.app.defaultRestTime);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetExercises({
      search: searchDebounced,
      muscleGroupId: selectedMuscleGroup?.id,
    });

  const exercises = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.data);
  }, [data]);

  const [selectedExercises, setSelectedExercises] = useState<
    z.infer<typeof ExerciseItemSchema>[]
  >([]);

  const onSelect = useCallback(
    ({
      item,
      index,
      isSelected,
    }: {
      item: z.infer<typeof ExerciseItemSchema>;
      index: number;
      isSelected: boolean;
    }) => {
      if (isSelected) {
        setSelectedExercises((prev) => prev.filter((e) => e.id !== item.id));
        return;
      }

      if (mode === "addToCreateWorkoutPlan") {
        setSelectedExercises((prev) => [...prev, item]);
        return;
      }
      if (mode === "replaceToCreateWorkoutPlan" && replaceWorkoutExerciseId) {
        setSelectedExercises([item]);
        dispatch(
          replaceExerciseInWorkout({
            workoutId: workoutId as string,
            workoutExerciseId: replaceWorkoutExerciseId,
            exercise: item,
            exerciseIndex: index,
          })
        );
        delay(() => router.back(), 200);
        return;
      }

      if (
        mode === "replaceToActiveWorkoutSession" &&
        replaceWorkoutExerciseId
      ) {
        dispatch(
          replaceExercise({
            exercise: {
              id: item.id,
              name: item.name,
              imageUrl: item.images?.[0] || "",
            },
            replacedExerciseId: replaceWorkoutExerciseId,
          })
        );
        delay(() => router.back(), 200);
        return;
      }
      setSelectedExercises((prev) => [...prev, item]);
    },
    [mode, dispatch, workoutId, replaceWorkoutExerciseId]
  );

  const onFinish = useCallback(() => {
    if (mode === "addToCreateWorkoutPlan") {
      dispatch(
        addWorkoutExercises({
          workoutId: workoutId as string,
          exercises: selectedExercises,
        })
      );
    }
    if (mode === "addToActiveWorkoutSession") {
      // dispatch(
      //   addWorkoutExercisesToActiveWorkoutSession({
      //     exercises: selectedExercises,
      //     defaultSets,
      //     defaultRestTime,
      //   })
      // );
    }
    router.back();
  }, [
    mode,
    dispatch,
    selectedExercises,
    workoutId,
    defaultSets,
    defaultRestTime,
  ]);

  const renderItem = ({
    item,
    index,
  }: LegendListRenderItemProps<z.infer<typeof ExerciseItemSchema>>) => {
    const isSelected =
      selectedExercises.findIndex((e) => e.id === item.id) !== -1;

    return (
      <ExerciseItem
        item={item}
        index={index}
        setCount={undefined}
        right={
          allowSelect ? (
            <Radio
              selected={isSelected}
              onPress={() => onSelect({ item, index, isSelected })}
            />
          ) : null
        }
      />
    );
  };

  return (
    <AppScreen name="exercises-screen" safeAreaEdges={["top"]}>
      <AppHeader
        title={capitalize(t("exercises"))}
        withBackButton
        Right={
          allowSelect &&
          (mode === "addToCreateWorkoutPlan" ||
            mode === "addToActiveWorkoutSession") ? (
            <AppTouchable
              onPress={() =>
                debouncedPress(() => {
                  onFinish();
                })
              }
            >
              <CheckIcon size={28} />
            </AppTouchable>
          ) : null
        }
      />
      <View className="gap-4 px-4 pt-6 pb-2">
        <View className="flex-row items-center gap-2 bg-slate-500 dark:bg-slate-700 px-6 py-4 rounded-md">
          <SearchIcon color="white" />
          <TextInput
            testID="search-input"
            className="flex-1 text-white"
            placeholder={t("search")}
            placeholderTextColor={colors.text.dark.main}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() =>
              debouncedPress(() => {
                muscleGroupModalRef.current?.present();
              })
            }
            testID="select-muscle-group-button"
          >
            <View className="flex-row items-center gap-2 border border-slate-500 dark:border-slate-900 rounded-md p-2">
              <AppText>
                {selectedMuscleGroup?.translations?.[0].name ||
                  t("all_muscles")}
              </AppText>
              <ChevronDownIcon />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View className="flex-row items-center gap-2 border border-slate-500 dark:border-slate-900 rounded-md p-2">
              <AppText>{t("all_equipment")}</AppText>
              <ChevronDownIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <LegendList
        ref={listRef}
        testID="exercises-list"
        data={exercises || []}
        extraData={selectedExercises}
        renderItem={renderItem}
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingHorizontal: 12,
        }}
        keyExtractor={(item) => item?.id?.toString() || ""}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        drawDistance={Env.TEST_MODE ? 10000 : 10 * 100} // 10 items * 100px
        estimatedItemSize={100}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center justify-center">
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            </View>
          ) : null
        }
      />

      <SelectMuscleGroupSheet
        modalRef={muscleGroupModalRef}
        setSelectedMuscleGroup={setSelectedMuscleGroup}
      />

      <TouchableOpacity
        className="absolute bottom-8 right-4 bg-primary-500 rounded-full p-4 dark:bg-primary bg-primaryDarken"
        onPress={() =>
          debouncedPress(() => {
            if (!session?.session) {
              Alert.alert(t("login_required"), t("login_required_description"));
              return;
            }
            router.push(appRoutes.exercises.create());
          })
        }
        testID="create-exercise-button"
        hitSlop={20}
      >
        <PlusIcon color="black" size={18} />
      </TouchableOpacity>
    </AppScreen>
  );
};
