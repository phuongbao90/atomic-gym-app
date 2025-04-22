import { TouchableOpacity, View } from "react-native";
import { AppText } from "../../../components/ui/app-text";
import { VerticalDotsIcon } from "../../../components/ui/expo-icon";
import { convertToHourMinuteSecond } from "../../../utils/convert-to-hour-minute-second";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { appRoutes } from "../../../configs/routes";
import { ExerciseSet } from "app";
import { capitalize } from "lodash";

export const SetItem = ({
  index,
  workoutIndex,
  exerciseIndex,
  onPressMore,
  exerciseSet,
}: {
  workoutIndex: number;
  exerciseIndex: number;
  index: number;
  onPressMore: () => void;
  exerciseSet: ExerciseSet;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <TouchableOpacity
      className="flex-row items-center gap-4"
      testID={`set-item-${index}`}
      onPress={() => {
        router.navigate(
          appRoutes.workoutPlans.editSet({
            workoutIndex: workoutIndex,
            exerciseIndex: exerciseIndex,
            setIndex: index,
          })
        );
      }}
    >
      <View className="w-14 h-14 rounded-full items-center justify-center border-primaryDarken border-2">
        <AppText className="text-primaryDarken text-xl font-bold">
          {index + 1}
        </AppText>
      </View>
      <View className="gap-0 flex-1">
        <AppText className="text-lg font-bold">Set {index + 1}</AppText>
        <AppText className="text-lg">
          {exerciseSet.isWarmup && `${capitalize(t("warmup"))} - `}
          {exerciseSet.isDropSet && `${capitalize(t("drop_set"))} - `}
          {exerciseSet.isUntilFailure && `${capitalize(t("until_failure"))} - `}
          {convertToHourMinuteSecond(exerciseSet.restTime)} {t("rest")}
        </AppText>
      </View>
      <TouchableOpacity hitSlop={10} className="ml-auto" onPress={onPressMore}>
        <VerticalDotsIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
