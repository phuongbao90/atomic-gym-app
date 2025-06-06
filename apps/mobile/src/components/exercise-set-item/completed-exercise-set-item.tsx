import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../stores/redux-store";
import { VerticalDotsIcon } from "../ui/expo-icon";
import { View } from "react-native";
import { AppText } from "../ui/app-text";
import { AppTouchable } from "../ui/app-touchable";
import { OrderNumberCircle } from "../ui/OrderNumberCircle";
import { ExerciseSetItemProps } from "./exercise-set-item-type";
import { useExerciseSetItemContext } from "./exercise-set-item.context";

export const CompletedSetItemWithContext = () => {
  const { exerciseSet, index, onPressMoreCompleted } =
    useExerciseSetItemContext();

  return (
    <CompletedSetItem
      index={index}
      exerciseSet={exerciseSet}
      onPressMore={onPressMoreCompleted}
    />
  );
};

export const CompletedSetItem = ({
  exerciseSet,
  index,
  onPressMore,
}: {
  exerciseSet: {
    weight: number;
    repetitions: number;
  };
  index: ExerciseSetItemProps["index"];
  onPressMore: () => void;
}) => {
  const { t } = useTranslation();
  const weightUnit = useAppSelector((s) => s.app.weightUnit);

  return (
    <View className="rounded-xl overflow-hidden">
      <View className="flex-row items-center py-4 px-4 bg-slate-600">
        <OrderNumberCircle orderNumber={index + 1} isActive />
        <AppText className="text-xl ml-4">
          {exerciseSet?.weight} {weightUnit} x {exerciseSet?.repetitions}{" "}
          {t("reps")}
        </AppText>
        <AppTouchable
          onPress={() => onPressMore()}
          className="absolute right-3"
        >
          <VerticalDotsIcon />
        </AppTouchable>
      </View>
    </View>
  );
};
