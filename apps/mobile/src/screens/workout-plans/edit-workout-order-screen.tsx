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
import { Workout } from "app";
import { CreateWorkoutPlanSliceType } from "../../stores/slices/create-workout-plan-slice";

export const EditWorkoutOrderScreen = () => {
  const { t } = useTranslation();
  const workouts = useAppSelector(
    (state) => state.createWorkoutPlan.workoutPlan?.workouts
  );

  const dispatch = useAppDispatch();

  const renderItem = ({
    getIndex,
    drag,
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

          <AppText className="text-xl">
            {t("day", { count: (getIndex() as number) + 1 })}
          </AppText>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <AppScreen name="edit-workout-order-screen">
      <AppHeader title={t("reorder_workouts")} withBackButton />
      <DraggableFlatList
        keyExtractor={(item) => item.id.toString()}
        data={workouts}
        renderItem={renderItem}
        pagingEnabled={true}
        onDragEnd={({ from, to }) => {
          //   setIsDragging(false);
          //   dispatch(updateExerciseOrder({ from, to }));
        }}
        // activationDistance={isDragging ? 1 : 20}
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
