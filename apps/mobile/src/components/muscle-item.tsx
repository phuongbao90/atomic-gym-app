import { MuscleGroup } from "app";
import { Image } from "expo-image";
import { View } from "react-native";
import { AppText } from "./ui/app-text";
import { use$ } from "@legendapp/state/react";
import { appStore$ } from "../stores/app-store";

export const MuscleItem = ({
  muscleGroup,
}: {
  muscleGroup: MuscleGroup;
}) => {
  const theme = use$(appStore$.theme);
  return (
    <View className="flex-row items-center gap-6" key={muscleGroup.id}>
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
      <AppText className="text-xl font-semibold">
        {muscleGroup.translations?.[0].name}
      </AppText>
    </View>
  );
};
