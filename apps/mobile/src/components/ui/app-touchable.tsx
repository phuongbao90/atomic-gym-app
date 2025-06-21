import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";

export const AppTouchable = ({
  debounce = true,
  debounceDelay,
  isLoading = false,
  ...props
}: TouchableOpacityProps & {
  debounce?: boolean;
  debounceDelay?: number;
  isLoading?: boolean;
}) => {
  const debounceFn = usePreventRepeatPress(debounceDelay);

  return (
    <TouchableOpacity
      hitSlop={20}
      {...props}
      onPress={(e) => {
        if (debounce) {
          debounceFn(() => props.onPress?.(e));
        } else {
          props.onPress?.(e);
        }
      }}
    >
      {isLoading ? <ActivityIndicator /> : props.children}
    </TouchableOpacity>
  );
};
