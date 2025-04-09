import { Workout } from "app";
import { Text, View } from "react-native";
import { ExpoIcon } from "./ui/expo-icon";
import { Link } from "expo-router";
import { appRoutes } from "../configs/routes";
import { useTranslation } from "react-i18next";

const Badge = ({ label }: { label: string }) => {
  return (
    <View className="px-5 py-1 bg-primary rounded-2xl">
      <Text className="text-dark">{label}</Text>
    </View>
  );
};

export const WorkoutItem = ({
  workout,
  index,
  isPremiumPlan,
}: {
  workout: Workout & { _count: { exercises: number } };
  index: number;
  isPremiumPlan: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Link href={appRoutes.workouts.detail(workout.id.toString())}>
      <View
        className="flex-row items-center bg-slate-200 rounded-lg py-3 px-2"
        testID={`workout-item-${index}`}
      >
        <Badge label={t("day", { count: index + 1 })} />
        <View className="mx-4 flex-1">
          <Text numberOfLines={1} style={{ flex: 1 }}>
            {workout?.translations?.[0]?.name}
          </Text>
          {!!workout?._count?.exercises && (
            <Text>
              {t("exercises_count", { count: workout._count.exercises })}
            </Text>
          )}
        </View>
        {isPremiumPlan && (
          <ExpoIcon
            name="lock"
            size={18}
            color="gray"
            library="entypo"
            className="ml-auto"
          />
        )}
      </View>
    </Link>
  );
};
