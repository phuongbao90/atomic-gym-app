import { View } from "react-native";
import { OrderNumberCircle } from "./ui/OrderNumberCircle";
import { AppText } from "./ui/app-text";
import { capitalize } from "lodash";
import { useTranslation } from "react-i18next";
import { cn } from "../utils/cn";
import { AppTouchable } from "./ui/app-touchable";

export const WorkoutExerciseItem = ({
  index,
  setsCount,
  exerciseName,
  completedSetsCount,
  className,
  onPress,
  onLongPress,
  Right,
}: {
  index: number;
  setsCount: number;
  exerciseName: string;
  completedSetsCount: number;
  className?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  Right?: React.ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <View
      className={cn("flex-row items-center gap-x-4 py-4 pl-2 pr-2", className)}
    >
      <AppTouchable
        onPress={() => onPress?.()}
        onLongPress={() => onLongPress?.()}
      >
        <OrderNumberCircle
          orderNumber={index}
          isActive={completedSetsCount === setsCount}
        />
      </AppTouchable>
      <AppTouchable
        onPress={() => onPress?.()}
        onLongPress={() => onLongPress?.()}
        className="mr-auto flex-1"
      >
        <View>
          <AppText className="text-lg font-semibold">
            {capitalize(exerciseName)}
          </AppText>
          <AppText>{`${completedSetsCount}/${setsCount} ${t("sets_completed")}`}</AppText>
        </View>
      </AppTouchable>
      {Right && Right}
    </View>
  );
};
