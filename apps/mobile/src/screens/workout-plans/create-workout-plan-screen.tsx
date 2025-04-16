import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { useAppSelector } from "../../stores/redux-store";

export const CreateWorkoutPlanScreen = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const language = useAppSelector((state) => state.app.language);

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
