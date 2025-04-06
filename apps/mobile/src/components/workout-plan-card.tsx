import Entypo from "@expo/vector-icons/Entypo";
import { WorkoutPlan } from "app";
import { Image, ImageBackground } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { appRoutes } from "../configs/routes";

export const WorkoutPlanCard = ({
  item,
}: {
  item: WorkoutPlan & { _count?: { workouts: number } };
}) => {
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
            <Text className="text-white text-lg font-bold">{item.name}</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-xs">{item.level}</Text>
              {!!item?._count?.workouts && (
                <Text className="text-white text-xs">
                  {item?._count?.workouts} days per week
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
    <View className="flex-row items-center gap-2">
      <Image
        source={{ uri: item.cover_image }}
        style={{ width: 46, height: 46, borderRadius: 10 }}
        contentFit="cover"
      />
      <Text
        numberOfLines={1}
        className="text-base font-semibold"
        style={{ maxWidth: "82%" }}
      >
        {item.name}
      </Text>
      {item.isPremium && (
        <Entypo name="lock" size={18} color="gray" className="ml-auto" />
      )}
    </View>
  );
};
