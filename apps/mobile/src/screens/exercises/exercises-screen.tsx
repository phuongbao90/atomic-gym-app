import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { use$ } from "@legendapp/state/react";
import { appStore$ } from "../../stores/app-store";
import { capitalize } from "lodash";
import {
  LegendList,
  LegendListRef,
  LegendListRenderItemProps,
} from "@legendapp/list";
import { Exercise, MuscleGroup, useGetExercises } from "app";
import { useMemo, useRef, useState } from "react";
import { AppText } from "../../components/ui/app-text";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ExpoIcon } from "../../components/ui/expo-icon";
import { ExerciseItem } from "../../components/exercise-item";
import { colors, PRIMARY_COLOR } from "../../styles/themes";
import { useDebounce } from "../../hooks/use-debounce";
import { SelectMuscleGroupSheet } from "../../components/bottom-sheets/select-muscle-group";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FloatingButton } from "../../components/ui/floating-button";
import { appRoutes } from "../../configs/routes";
import { router } from "expo-router";
import { Env } from "../../configs/env";

export const ExercisesScreen = () => {
  const { t } = useTranslation();
  const theme = use$(appStore$.theme);
  const language = use$(appStore$.language);
  const listRef = useRef<LegendListRef | null>(null);
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);
  const muscleGroupModalRef = useRef<BottomSheetModal>(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<MuscleGroup | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetExercises({
      search: searchDebounced,
      muscleGroupId: selectedMuscleGroup?.id,
    });

  const exercises = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.data);
  }, [data]);

  const renderItem = ({ item, index }: LegendListRenderItemProps<Exercise>) => {
    return <ExerciseItem item={item} index={index} />;
  };

  return (
    <AppScreen name="exercise-screen">
      <AppHeader
        title={capitalize(t("exercises"))}
        theme={theme}
        language={language}
        withBackButton
      />
      <View className="gap-4 px-4 pt-6 pb-2">
        <View className="flex-row items-center gap-2 bg-slate-500 dark:bg-slate-700 px-6 py-4 rounded-md">
          <ExpoIcon library="feather" name="search" color="white" />
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
            onPress={() => {
              muscleGroupModalRef.current?.present();
            }}
            testID="select-muscle-group-button"
          >
            <View className="flex-row items-center gap-2 border border-slate-500 dark:border-slate-900 rounded-md p-2">
              <AppText>
                {selectedMuscleGroup?.translations?.[0].name ||
                  t("all_muscles")}
              </AppText>
              <ExpoIcon library="feather" name="chevron-down" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View className="flex-row items-center gap-2 border border-slate-500 dark:border-slate-900 rounded-md p-2">
              <AppText>{t("all_equipment")}</AppText>
              <ExpoIcon library="feather" name="chevron-down" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* <FlatList
        ref={listRef}
        testID="exercises-list"
        data={exercises || []}
        renderItem={renderItem}
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        // estimatedItemSize={100}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center justify-center">
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            </View>
          ) : null
        }
      /> */}
      <LegendList
        ref={listRef}
        testID="exercises-list"
        data={exercises || []}
        renderItem={renderItem}
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        drawDistance={Env.TEST_MODE ? 10000 : 250}
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

      <FloatingButton
        onPress={() => router.push(appRoutes.exercises.create())}
        testID="create-exercise-button"
      />
    </AppScreen>
  );
};
