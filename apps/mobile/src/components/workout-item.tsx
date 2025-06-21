import { Text, View } from "react-native";
import { LockIcon } from "./ui/expo-icon";
import { Link } from "expo-router";
import { appRoutes } from "app-config";
import { useTranslation } from "react-i18next";
import { WorkoutPlanItemResponseSchema } from "app-config";
import { z } from "zod";

const Badge = ({ label }: { label: string }) => {
  return (
    <View className="px-5 py-1 bg-primary rounded-2xl">
      <Text className="text-dark">{label}</Text>
    </View>
  );
};

export const WorkoutItem = ({
  workoutTemplate,
  index,
  isPremiumPlan,
}: {
  workoutTemplate: z.infer<
    typeof WorkoutPlanItemResponseSchema
  >["workoutTemplates"][number];
  index: number;
  isPremiumPlan: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Link href={appRoutes.workouts.detail(workoutTemplate.id.toString())}>
      <View
        className="flex-row items-center bg-slate-200 rounded-lg py-3 px-2"
        testID={`workout-item-${index}`}
      >
        <Badge label={t("day", { count: index + 1 })} />
        <View className="mx-4 flex-1">
          <Text numberOfLines={1} style={{ flex: 1 }}>
            {workoutTemplate?.name}
          </Text>
          {!!workoutTemplate?.templateExercises?.length && (
            <Text>
              {t("exercises_count", {
                count: workoutTemplate?.templateExercises?.length,
              })}
            </Text>
          )}
        </View>
        {isPremiumPlan && (
          <LockIcon size={18} color="gray" className="ml-auto" />
        )}
      </View>
    </Link>
  );
};
