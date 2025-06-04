import { RefreshControl, StyleSheet, View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppHeader } from "../../components/ui/app-header";
import { useTranslation } from "react-i18next";
import {
  useDeleteWorkoutSessionExercise,
  useWorkoutSessionDetail,
} from "app/src/query/workout-session/workout-session.hooks";
import { VerticalDotsIcon } from "../../components/ui/expo-icon";
import { LegendList } from "@legendapp/list";
import {
  GroupedSetsByExercise,
  useGroupSetsByExercise,
} from "./hooks/use-group-sets-by-exercise";
import { WorkoutExerciseItem } from "../../components/workout-exercise-item";
import ContextMenu from "react-native-context-menu-view";
import { appRoutes } from "../../configs/routes";

export const EditWorkoutSessionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { mutate: deleteWorkoutSessionExercise } =
    useDeleteWorkoutSessionExercise();
  const router = useRouter();
  const {
    data: workoutSession,
    refetch,
    isRefetching,
    isPending,
  } = useWorkoutSessionDetail(id);
  const setsGroupByExercise = useGroupSetsByExercise(workoutSession?.setLogs);

  const renderItem = ({
    item,
    index,
  }: {
    item: GroupedSetsByExercise;
    index: number;
  }) => {
    return (
      <WorkoutExerciseItem
        index={index + 1}
        setsCount={item.sets.length}
        exerciseName={item.exerciseName}
        completedSetsCount={item.sets.filter((s) => s.isCompleted).length}
        className="border-b border-gray-500"
        onPress={() => {
          router.navigate(
            appRoutes.workoutSession.editExercise(id, item.exerciseId)
          );
        }}
        Right={
          <ContextMenu
            actions={[{ title: t("delete") }, { title: t("replace") }]}
            onPress={(e) => {
              if (e.nativeEvent.index === 0) {
                deleteWorkoutSessionExercise(
                  {
                    id,
                    exerciseId: item.exerciseId,
                  },
                  {
                    onSuccess: () => {
                      refetch?.();
                    },
                  }
                );
              }
              if (e.nativeEvent.index === 1) {
                console.log("replace");
              }
            }}
            dropdownMenuMode={true}
            hitSlop={50}
            style={styles.moreButton}
          >
            <VerticalDotsIcon size={28} />
          </ContextMenu>
        }
      />
    );
  };

  return (
    <AppScreen name="edit-workout-session-screen" isLoading={isPending}>
      <AppHeader
        title={
          <View className="flex-col gap-1 ml-4">
            <AppText className="text-xl font-bold">{t("edit_session")}</AppText>
            <AppText className="text-lg text-green-500 font-semibold">
              {workoutSession?.workoutNameSnapshot}
            </AppText>
          </View>
        }
        withBackButton
      />
      <LegendList
        data={Object.values(setsGroupByExercise)}
        renderItem={renderItem}
        keyExtractor={(item) => {
          return item.exerciseId;
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
