import { Image } from "expo-image";
import { View } from "react-native";
import { AppText } from "./ui/app-text";
import { useAppSelector } from "../stores/redux-store";
import { cn } from "../utils/cn";
import { MuscleGroupItemSchema } from "app-config";
import { z } from "zod";

export const MuscleItem = ({
  muscleGroup,
  vertical = false,
  className,
}: {
  muscleGroup: z.infer<typeof MuscleGroupItemSchema>;
  vertical?: boolean;
  className?: string;
}) => {
  // console.log("🚀 ~ muscleGroup:", JSON.stringify(muscleGroup, null, 2));
  const theme = useAppSelector((state) => state.app.theme);
  return (
    <View
      testID={`muscle-item-${muscleGroup.id}`}
      className={cn(
        "flex-row items-center gap-6",
        vertical && "flex-col items-center gap-2",
        className
      )}
    >
      {vertical ? (
        <>
          <AppText className={cn("text-xl font-semibold text-center")}>
            {muscleGroup.name}
          </AppText>
          <Image
            source={muscleGroup.image}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              borderWidth: 2,
              borderColor: theme === "dark" ? "white" : "black",
            }}
            contentFit="cover"
          />
        </>
      ) : (
        <>
          <Image
            source={muscleGroup.image}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              borderWidth: 2,
              borderColor: theme === "dark" ? "white" : "black",
            }}
            contentFit="cover"
          />
          <AppText className={cn("text-xl font-semibold")}>
            {muscleGroup.name}
          </AppText>
        </>
      )}
    </View>
  );
};
