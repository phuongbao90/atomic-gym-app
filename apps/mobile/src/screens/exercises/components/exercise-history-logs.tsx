import { Exercise } from "app";
import { AppText } from "../../../components/ui/app-text";
import { useTranslation } from "react-i18next";
import { AppScrollView } from "../../../components/ui/app-scrollview";

export const ExerciseHistoryLogs = ({ exercise }: { exercise: Exercise }) => {
  const { t } = useTranslation();
  return (
    <AppScrollView
      contentContainerStyle={{
        paddingTop: 20,
      }}
    >
      <AppText className="text-center text-lg">
        {t("no_exercise_history")}
      </AppText>
    </AppScrollView>
  );
};
