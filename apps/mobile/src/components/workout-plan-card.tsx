import Entypo from "@expo/vector-icons/Entypo";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { appRoutes } from "../configs/routes";
import { AppText } from "./ui/app-text";
import { useTranslation } from "react-i18next";
import { usePreventRepeatPress } from "../hooks/use-prevent-repeat-press";
import { AppImage } from "./ui/app-image";
import { WorkoutPlanItemResponseSchema } from "app-config";
import { z } from "zod";
import { toast } from "sonner-native";

export const WorkoutPlanCard = ({
  item,
}: {
  item: z.infer<typeof WorkoutPlanItemResponseSchema>;
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const debouncedPress = usePreventRepeatPress();
  const count = item?._count?.workoutTemplates;

  if (!item) return null;

  return (
    <Pressable
      onPress={() => {
        debouncedPress(() => {
          router.push(appRoutes.workoutPlans.detail(item.id.toString()));
        });
      }}
      testID="workout-plan-card"
    >
      <View className="w-72 h-44 rounded-lg overflow-hidden">
        <ImageBackground
          source={item.cover_image ? { uri: item.cover_image } : undefined}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit="cover"
          testID="workout-plan-card-image"
        >
          <View className="items-start justify-end flex-1 px-2 pb-2 gap-1 bg-black/30">
            {item.isPremium && <LockIcon />}
            <Text className="text-white text-lg font-bold">{item.name}</Text>
            <View className="flex-row items-center gap-1">
              {item.level && (
                <Text className="text-white text-xs">{t(item.level)}</Text>
              )}

              {!!count && (
                <Text className="text-white text-xs">
                  {t("days_per_week", { count })}
                </Text>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </Pressable>
  );
};

const LockIcon = () => (
  <View
    className="absolute top-2 right-2 w-8 h-8 items-center justify-center rounded-full bg-black/40"
    testID="lock-icon"
  >
    <Entypo name="lock" size={16} color="white" />
  </View>
);

export const SingleWorkoutPlanCard = ({
  item,
}: {
  item: z.infer<typeof WorkoutPlanItemResponseSchema>;
}) => {
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();

  return (
    <Pressable
      onPress={() => {
        const workoutTemplateId = item.workoutTemplates[0].id;
        if (!workoutTemplateId) {
          toast("Workout template id missing");
          return;
        }

        debouncedPress(() => {
          router.push(appRoutes.workouts.detail(workoutTemplateId));
        });
      }}
      testID="single-workout-plan-card"
    >
      <View className="flex-row items-center gap-4">
        <AppImage
          uri={item.cover_image}
          style={{ width: 46, height: 46, borderRadius: 10 }}
          contentFit="cover"
          testID="single-workout-plan-card-image"
        />
        <AppText
          numberOfLines={1}
          className="text-base font-semibold"
          style={{ maxWidth: "82%" }}
        >
          {item.name}
        </AppText>
        {item.isPremium && (
          <Entypo
            name="lock"
            size={18}
            color="gray"
            className="ml-auto"
            testID="lock-icon"
          />
        )}
      </View>
    </Pressable>
  );
};
