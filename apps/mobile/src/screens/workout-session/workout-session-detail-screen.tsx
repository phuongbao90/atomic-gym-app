import { View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { useLocalSearchParams } from "expo-router";
import { AppHeader } from "../../components/ui/app-header";
import { useWorkoutSessionDetail } from "app/src/query/workout-session/workout-session.hooks";
import { useTranslation } from "react-i18next";
import { AppTouchable } from "../../components/ui/app-touchable";
import {
  ClockIcon,
  DeleteIcon,
  EditIcon,
  SessionDurationIcon,
  SetsCompletedIcon,
  VerticalDotsIcon,
  WeightIcon,
} from "../../components/ui/expo-icon";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { Divider } from "../../components/ui/divider";
import dayjs from "dayjs";
import { convertToHourMinuteSecond } from "../../utils/convert-to-hour-minute-second";
import { twColors } from "../../styles/themes";

export const WorkoutSessionDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: workoutSession } = useWorkoutSessionDetail(id);

  return (
    <AppScreen name="workout-session-detail-screen">
      <AppHeader
        title={t("session_detail")}
        withBackButton
        Right={
          <View className="flex-row items-center gap-6">
            <AppTouchable>
              <EditIcon color={twColors.blue[600]} />
            </AppTouchable>
            <AppTouchable>
              <DeleteIcon color={twColors.red[600]} />
            </AppTouchable>
          </View>
        }
      />
      <AppScrollView
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 12,
        }}
      >
        <AppText className="text-2xl">
          {workoutSession?.workout.translations[0].name}
        </AppText>

        <Divider className="my-4" />
        <View className="flex-row items-center gap-6">
          <ClockIcon />
          <AppText className="text-xl">
            {dayjs(workoutSession?.createdAt).format("ddd, DD MMM")}
          </AppText>
        </View>
        <Divider className="my-4" />
        <View className="flex-row items-center justify-between">
          <View className="items-center w-1/3">
            <SessionDurationIcon />
            <AppText className="mt-2">{t("duration")}</AppText>
            <AppText className="text-xl">
              {convertToHourMinuteSecond(workoutSession?.duration || 0)}
            </AppText>
          </View>
          <View className="items-center w-1/3">
            <SetsCompletedIcon />
            <AppText className="mt-2">{t("sets")}</AppText>
            <AppText className="text-xl">
              {workoutSession?.setLogs?.length}
            </AppText>
          </View>
          <View className="items-center w-1/3">
            <WeightIcon />
            <AppText className="mt-2">{t("weight")} (kg)</AppText>
            <AppText className="text-xl">
              {workoutSession?.setLogs?.reduce(
                (acc, curr) => acc + curr.weight,
                0
              )}
            </AppText>
          </View>
        </View>
        <Divider className="my-4" />
      </AppScrollView>
    </AppScreen>
  );
};
