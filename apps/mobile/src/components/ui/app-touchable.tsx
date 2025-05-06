import {
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export const AppTouchable = (props: TouchableOpacityProps) => {
  const TouchableComponent =
    Platform.OS === "android" ? TouchableOpacity : TouchableOpacity;

  return <TouchableComponent hitSlop={10} {...props} />;
};
