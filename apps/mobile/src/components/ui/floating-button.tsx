import { TouchableOpacity } from "react-native";
import { ExpoIcon } from "./expo-icon";

export const FloatingButton = ({
  onPress,
  testID,
}: {
  onPress: () => void;
  testID?: string;
}) => {
  return (
    <TouchableOpacity
      className="absolute bottom-8 right-4 bg-primary-500 rounded-full p-4 dark:bg-primary bg-primaryDarken"
      onPress={onPress}
      hitSlop={20}
      testID={testID}
    >
      <ExpoIcon library="feather" name="plus" color="black" size={18} />
    </TouchableOpacity>
  );
};
