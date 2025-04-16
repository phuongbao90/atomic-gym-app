import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useLocalSearchParams } from "expo-router";
import { useGetWorkout } from "app";
import { ActivityIndicator, View } from "react-native";
import { ExerciseItem } from "../../components/exercise-item";
import { AppFlatList } from "../../components/ui/app-flat-list";
import { AppButton } from "../../components/ui/app-button";
import { useTranslation } from "react-i18next";
import { AppText } from "../../components/ui/app-text";
import { useAppSelector } from "../../stores/redux-store";

export function WorkoutDetailScreen() {
  const theme = useAppSelector((state) => state.app.theme);
  const language = useAppSelector((state) => state.app.language);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: workout, isLoading } = useGetWorkout(Number(id));

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        testID="loading-indicator"
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AppScreen name="workout-detail-screen">
      <AppHeader
        title={workout?.translations?.[0]?.name}
        theme={theme}
        language={language}
        withBackButton
      />

      <AppFlatList
        data={workout?.exercises}
        renderItem={({ item, index }) => (
          <ExerciseItem item={item} index={index} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 60,
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <AppText>{t("no_exercises")}</AppText>
          </View>
        )}
      />
      <AppScreen.Footer>
        <AppButton
          testID="start-workout-button"
          title={t("start_workout")}
          fullWidth
          containerClassName="px-4 pb-4"
          radius="xl"
          color="primary"
        />
      </AppScreen.Footer>
    </AppScreen>
  );
}
