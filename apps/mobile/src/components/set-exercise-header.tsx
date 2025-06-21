import { View } from "react-native";
import { AppText } from "./ui/app-text";
import { useRouter } from "expo-router";
import { AppTouchable } from "./ui/app-touchable";
import { appRoutes } from "app-config";
import { AppImage } from "./ui/app-image";
import { capitalize } from "lodash";

export const SetExerciseHeader = ({
  exerciseImageUrl,
  exerciseName,
  exerciseId,
}: {
  exerciseImageUrl: string | undefined;
  exerciseName: string | undefined;
  exerciseId: string;
}) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center gap-4">
      <AppTouchable
        onPress={() => {
          router.navigate(appRoutes.exercises.detail(exerciseId));
        }}
      >
        <AppImage
          uri={exerciseImageUrl}
          style={{ width: 80, height: 80, borderRadius: 10 }}
        />
      </AppTouchable>
      <View>
        <AppText className="text-xl">{capitalize(exerciseName)}</AppText>
      </View>
    </View>
  );
};
