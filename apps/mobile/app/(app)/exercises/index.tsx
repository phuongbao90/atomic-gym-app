import { use$ } from "@legendapp/state/react";
import { Exercise, exerciseQuery } from "app";
import { useRouter } from "expo-router";
import { ExerciseItem } from "../../../src/components/exercise-item";
import { AppHeader } from "../../../src/components/ui/app-header";
import { AppScreen } from "../../../src/components/ui/app-screen";
import { AppText } from "../../../src/components/ui/app-text";
import { appStore$ } from "../../../src/stores/app-store";

import { appRoutes } from "../../../src/configs/routes";

export default function Exercises() {
  const router = useRouter();
  const theme = use$(appStore$.theme);
  const language = use$(appStore$.language);

  const query = exerciseQuery.getExercises();

  const renderItem = ({ item }: { item: Exercise }) => {
    return <ExerciseItem item={item} />;
  };

  return (
    <AppScreen name="exercises-screen">
      <AppHeader
        withBackButton
        title="Exercises"
        theme={theme}
        language={language}
        Right={
          <AppText
            className="text-xl font-bold uppercase"
            onPress={() => router.push(appRoutes.createExercise)}
          >
            Create
          </AppText>
        }
      />
    </AppScreen>
  );
}
