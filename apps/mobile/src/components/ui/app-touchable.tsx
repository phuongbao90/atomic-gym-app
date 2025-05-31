import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";

export const AppTouchable = ({
  debounce = true,
  debounceDelay,
  ...props
}: TouchableOpacityProps & {
  debounce?: boolean;
  debounceDelay?: number;
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
    />
  );
};
