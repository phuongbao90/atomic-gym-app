import Entypo from "@expo/vector-icons/Entypo";
import { WorkoutPlan } from "app";
import { Image, ImageBackground } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { appRoutes } from "../configs/routes";
import { AppText } from "./ui/app-text";
import { useTranslation } from "react-i18next";

type AutoTransformedWorkoutPlan = WorkoutPlan & {
  _count?: { workouts: number };
  name: string;
};

export const WorkoutPlanCard = ({
  item,
}: {
  item: (WorkoutPlan | AutoTransformedWorkoutPlan) & {
    _count?: { workouts: number };
  };
}) => {
  const { t } = useTranslation();
  return (
    <Link href={appRoutes.workoutPlans.detail(item.id.toString())}>
      <View className="w-72 h-44 rounded-lg overflow-hidden">
        <ImageBackground
          source={{ uri: item.cover_image }}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit="cover"
        >
          <View className="items-start justify-end flex-1 px-2 pb-2 gap-1 bg-black/30">
            {item.isPremium && <LockIcon />}
            <Text className="text-white text-lg font-bold">
              {item.translations?.[0]?.name ||
                (item as AutoTransformedWorkoutPlan)?.name}
            </Text>
            <View className="flex-row items-center gap-1">
              {item.level && (
                <Text className="text-white text-xs">{t(item.level)}</Text>
              )}

              {!!item?._count?.workouts && (
                <Text className="text-white text-xs">
                  {t("days_per_week", { count: item?._count?.workouts })}
                </Text>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </Link>
  );
};

const LockIcon = () => (
  <View className="absolute top-2 right-2 w-8 h-8 items-center justify-center rounded-full bg-black/40">
    <Entypo name="lock" size={16} color="white" />
  </View>
);

export const SingleWorkoutPlanCard = ({
  item,
}: {
  item: WorkoutPlan;
}) => {
  return (
    <Link href={appRoutes.workouts.detail(item.id.toString())}>
      <View className="flex-row items-center gap-4">
        <Image
          source={{ uri: item.cover_image }}
          style={{ width: 46, height: 46, borderRadius: 10 }}
          contentFit="cover"
        />
        <AppText
          numberOfLines={1}
          className="text-base font-semibold"
          style={{ maxWidth: "82%" }}
        >
          {item.translations?.[0]?.name}
        </AppText>
        {item.isPremium && (
          <Entypo name="lock" size={18} color="gray" className="ml-auto" />
        )}
      </View>
    </Link>
  );
};
