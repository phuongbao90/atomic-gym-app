import { TouchableOpacity, View } from "react-native";
import { CheckIcon } from "./expo-icon";

export const Radio = ({
  selected,
  onPress,
}: {
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity hitSlop={10} onPress={onPress}>
      <View
        className="border-2 border-black dark:border-white rounded-sm w-6 h-6 items-center justify-center"
        pointerEvents="none"
      >
        {selected && <CheckIcon size={16} />}
      </View>
    </TouchableOpacity>
  );
};
