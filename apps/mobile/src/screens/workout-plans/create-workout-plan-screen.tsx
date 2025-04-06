import { use$ } from "@legendapp/state/react";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { appStore$ } from "../../stores/app-store";

export const CreateWorkoutPlanScreen = () => {
  const theme = use$(appStore$.theme);
  const language = use$(appStore$.language);

  return (
    <AppScreen name="create-workout-plan-screen">
      <AppHeader
        title="Create Workout Plan"
        withBackButton
        theme={theme}
        language={language}
      />
    </AppScreen>
  );
};
