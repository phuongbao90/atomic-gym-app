import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { Pressable, View } from "react-native";
import { AppText } from "../../components/ui/app-text";
import { DragIcon } from "../../components/ui/expo-icon";
import {
  InitialWorkoutPlan,
  overrideWorkoutOrders,
} from "../../stores/slices/create-workout-plan-slice";
import ReorderableList, {
  useReorderableDrag,
} from "react-native-reorderable-list";
import { useCallback } from "react";

export const EditWorkoutOrderScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const workoutTemplates = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan.workoutTemplates
  );

  const renderItem = useCallback(
    ({
      index,
      item,
    }: {
      index: number;
      item: InitialWorkoutPlan["workoutTemplates"][number];
    }) => {
      return <Item item={item} index={index} />;
    },
    []
  );

  return (
    <AppScreen name="edit-workout-order-screen">
      <AppHeader title={t("reorder_workouts")} withBackButton />
      <ReorderableList
        keyExtractor={(item) => item?.id?.toString() || ""}
        data={workoutTemplates}
        renderItem={renderItem}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 8,
        }}
        onReorder={({ from, to }) => {
          dispatch(
            overrideWorkoutOrders({
              from,
              to,
            })
          );
        }}
      />
    </AppScreen>
  );
};

const Item = ({
  item,
  index,
}: {
  item: InitialWorkoutPlan["workoutTemplates"][number];
  index: number;
}) => {
  const { t } = useTranslation();
  const drag = useReorderableDrag();
  return (
    <View className="flex-row items-center gap-x-2 py-5 border-b border-gray-500">
      <Pressable
        onLongPress={() => {
          drag();
        }}
        hitSlop={20}
      >
        <DragIcon size={28} color="white" />
      </Pressable>

      <View className="flex-1 gap-y-1">
        <AppText className="text-2xl">
          {t("day", { count: (index as number) + 1 })}
        </AppText>
        <AppText className="text-xl text-slate-600 dark:text-slate-400">
          {item.name}
        </AppText>
      </View>
    </View>
  );
};
