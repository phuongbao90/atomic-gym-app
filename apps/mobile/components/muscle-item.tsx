import { Exercise } from "app";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { AppText } from "./ui/app-text";

export const MuscleItem = ({
  muscleGroup,
}: {
  muscleGroup: Exercise["muscleGroups"][number];
}) => {
  const theme = useColorScheme();
  return (
    <View className="flex-row items-center gap-6" key={muscleGroup.id}>
      <Image
        source={muscleGroup.image}
        style={{
          width: 100,
          height: 100,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: theme.colorScheme === "dark" ? "white" : "black",
        }}
        contentFit="cover"
      />
      <AppText className="text-lg font-semibold">{muscleGroup.name}</AppText>
    </View>
  );
};
