import { View } from "react-native";
import { AppText } from "./app-text";
import { cn } from "../../utils/cn";

export const OrderNumberCircle = ({
  orderNumber,
  isActive,
  className,
}: {
  orderNumber: number;
  isActive?: boolean;
  className?: string;
}) => {
  return (
    <View
      className={cn(
        "w-12 h-12 bg-gray-500 items-center justify-center rounded-full",
        isActive && "bg-primaryDarken",
        className
      )}
    >
      <AppText className="text-lg">{orderNumber}</AppText>
    </View>
  );
};
