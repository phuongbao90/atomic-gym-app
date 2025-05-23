import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronLeftIcon } from "./expo-icon";
import { useRouter } from "expo-router";
import { cn } from "../../utils/cn";

export const BackButton = (props: TouchableOpacityProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      hitSlop={20}
      {...props}
      className={cn("p-2 absolute top-8 left-2 z-50", props.className)}
    >
      <ChevronLeftIcon />
    </TouchableOpacity>
  );
};
