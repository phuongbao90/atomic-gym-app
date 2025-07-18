import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { appRoutes } from "app-config";
import { AppText } from "./ui/app-text";
import { useTranslation } from "react-i18next";
import { usePreventRepeatPress } from "../hooks/use-prevent-repeat-press";
import { AppImage } from "./ui/app-image";
import { WorkoutPlanItemResponseSchema } from "app-config";
import { z } from "zod";
import { toast } from "sonner-native";
import { LockIcon as LockIconIcon } from "./ui/expo-icon";
import { AppImageBackground } from "./ui/app-background-image";

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
        <AppImageBackground
          uri={item.cover_image}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit="cover"
          testID="workout-plan-card-image"
        >
          <View className="items-start justify-end flex-1 px-2 pb-2 gap-1 bg-black/30">
            {item.isPremium && (
              <View
                className="absolute top-2 right-2 w-8 h-8 items-center justify-center rounded-full bg-black/40"
                testID="lock-icon"
              >
                <LockIconIcon size={16} color="white" />
              </View>
            )}
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
        </AppImageBackground>
      </View>
    </Pressable>
  );
};

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
          width={46}
          height={46}
          contentFit="cover"
          testID="single-workout-plan-card-image"
        />
        <AppText
          numberOfLines={1}
          className="text-base font-semibold mr-auto"
          style={{ maxWidth: "82%" }}
        >
          {item.name}
        </AppText>
        {item.isPremium && <LockIconIcon />}
      </View>
    </Pressable>
  );
};
