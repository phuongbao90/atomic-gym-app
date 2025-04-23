import { useTranslation } from "react-i18next";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { View } from "react-native";
import { AppText } from "../../components/ui/app-text";
import { DragIcon } from "../../components/ui/expo-icon";
import {
  CreateWorkoutPlanSliceType,
  overrideWorkoutOrders,
} from "../../stores/slices/create-workout-plan-slice";
import { useMemo } from "react";

export const EditWorkoutOrderScreen = () => {
  const { t } = useTranslation();
  const workouts = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan?.workouts
  );
  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => a.order - b.order);
  }, [workouts]);

  const dispatch = useAppDispatch();

  const renderItem = ({
    getIndex,
    drag,
    item,
  }: RenderItemParams<CreateWorkoutPlanSliceType["workouts"][number]>) => {
    return (
      <ScaleDecorator>
        <View className="flex-row items-center gap-x-2 py-5 border-b border-gray-500">
          <DragIcon
            size={28}
            color="white"
            onLongPress={() => {
              drag();
            }}
          />

          <View className="flex-1 gap-y-1">
            <AppText className="text-2xl">
              {t("day", { count: (getIndex() as number) + 1 })}
            </AppText>
            <AppText className="text-xl text-slate-600 dark:text-slate-400">
              {item.name}
            </AppText>
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <AppScreen name="edit-workout-order-screen">
      <AppHeader title={t("reorder_workouts")} withBackButton />
      <DraggableFlatList
        keyExtractor={(item) => item.id.toString()}
        data={sortedWorkouts}
        renderItem={renderItem}
        pagingEnabled={true}
        onDragEnd={({ data }) => {
          dispatch(overrideWorkoutOrders({ workouts: data }));
        }}
        style={{ flex: 1 }}
        containerStyle={{ flexGrow: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 8,
        }}
        // ItemSeparatorComponent={() => <Divider />}
      />
    </AppScreen>
  );
};
