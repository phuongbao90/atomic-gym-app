import { MuscleGroup } from "app";
import { Image } from "expo-image";
import { View } from "react-native";
import { AppText } from "./ui/app-text";
import { use$ } from "@legendapp/state/react";
import { appStore$ } from "../stores/app-store";
import { cn } from "../utils/cn";

export const MuscleItem = ({
  muscleGroup,
  vertical = false,
  className,
}: {
  muscleGroup: MuscleGroup;
  vertical?: boolean;
  className?: string;
}) => {
  const theme = use$(appStore$.theme);
  return (
    <View
      testID={`muscle-item-${muscleGroup.id}`}
      className={cn(
        "flex-row items-center gap-6",
        vertical && "flex-col items-center gap-2",
        className
      )}
      key={muscleGroup.id}
    >
      {vertical ? (
        <>
          <AppText className={cn("text-xl font-semibold text-center")}>
            {muscleGroup.translations?.[0].name}
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
            {muscleGroup.translations?.[0].name}
          </AppText>
        </>
      )}
    </View>
  );
};
