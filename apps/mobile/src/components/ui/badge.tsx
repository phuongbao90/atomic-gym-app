import { cn } from "../../utils/cn";
import { AppText } from "./app-text";
import { AppTouchable } from "./app-touchable";

export const Badge = ({
  label,
  onPress,
  isActive,
}: {
  label: string;
  onPress: () => void;
  isActive: boolean;
}) => {
  return (
    <AppTouchable
      onPress={onPress}
      className={cn({
        "bg-primary": isActive,
        "bg-white border border-gray-300": !isActive,
        "rounded-lg py-2 px-4": true,
      })}
    >
      <AppText className="text-dark dark:text-black">{label}</AppText>
    </AppTouchable>
  );
};
