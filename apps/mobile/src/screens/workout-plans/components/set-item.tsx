import { TouchableOpacity, View } from "react-native";
import { AppText } from "../../../components/ui/app-text";
import { VerticalDotsIcon } from "../../../components/ui/expo-icon";
import { convertToHourMinuteSecond } from "../../../utils/convert-to-hour-minute-second";
import { useTranslation } from "react-i18next";

export const SetItem = ({
  index,
  onPressMore,
}: {
  index: number;
  onPressMore: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      className="flex-row items-center gap-4"
      testID={`set-item-${index}`}
    >
      <View className="w-14 h-14 rounded-full items-center justify-center border-primaryDarken border-2">
        <AppText className="text-primaryDarken text-xl font-bold">
          {index + 1}
        </AppText>
      </View>
      <View className="gap-0">
        <AppText className="text-lg font-bold">Set {index + 1}</AppText>
        <AppText className="text-lg">
          {convertToHourMinuteSecond(120)} {t("rest")}
        </AppText>
      </View>
      <TouchableOpacity hitSlop={10} className="ml-auto" onPress={onPressMore}>
        <VerticalDotsIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
