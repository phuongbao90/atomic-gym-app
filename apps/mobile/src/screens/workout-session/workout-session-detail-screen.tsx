import { View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useLocalSearchParams } from "expo-router";

export const WorkoutSessionDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <AppScreen name="workout-session-detail-screen">
      <View>
        <AppText>Workout Session Detail</AppText>
      </View>
    </AppScreen>
  );
};
