import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View } from "react-native";
import { cn } from "../../utils/cn";

export const Icon = ({
  name,
  size = 20,
  color = "black",
  className,
  containerClassName,
}: {
  name: keyof typeof FontAwesome5.glyphMap;
  size?: number;
  color?: string;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <View
      className={cn(
        "flex-row self-start aspect-square items-center justify-center p-2 rounded-lg relative overflow-hidden",
        containerClassName
      )}
    >
      <View
        className="opacity-30 dark:opacity-20 absolute top-0 left-0 right-0 bottom-0"
        style={{
          backgroundColor: color,
        }}
      />
      <FontAwesome5
        name={name}
        size={size}
        color={color}
        className={cn("", className)}
      />
    </View>
  );
};
