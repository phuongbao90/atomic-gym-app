import { View } from "react-native";
import { AppText } from "./app-text";
import { cn } from "../../utils/cn";

export const OrderNumberCircle = ({
  orderNumber,
  isActive,
}: {
  orderNumber: number;
  isActive?: boolean;
}) => {
  return (
    <View
      className={cn(
        "w-12 h-12 bg-gray-500 items-center justify-center rounded-full",
        isActive && "bg-primaryDarken"
      )}
    >
      <AppText className="text-lg">{orderNumber}</AppText>
    </View>
  );
};
