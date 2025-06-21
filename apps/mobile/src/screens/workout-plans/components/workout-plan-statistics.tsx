import { useGetWorkoutPlanStats, WorkoutPlanWithStats } from "app";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  convertSecondsToHours,
  convertToHourMinuteSecond,
} from "../../../utils/convert-to-hour-minute-second";
import { Box } from "../../../components/box";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { PlanStatsChart } from "./plan-stats-chart";

export const WorkoutPlanStatistics = ({
  item,
}: {
  item: WorkoutPlanWithStats | undefined;
}) => {
  const { t } = useTranslation();
  const { data: stats } = useGetWorkoutPlanStats(item?.id!);

  return (
    <View className=" mt-4 gap-y-4">
      <View className="flex-row flex-wrap gap-4 pl-4">
        <Box
          label={t("workout_sessions")}
          value={stats?.sessionCount || 0}
          style={{ width: SCREEN_WIDTH / 2 - 20 }}
        />
        <Box
          label={t("total_time (hrs)")}
          value={convertSecondsToHours(stats?.totalDuration || 0).toFixed(1)}
          style={{ width: SCREEN_WIDTH / 2 - 20 }}
        />
        <Box
          label={t("avg.session_duration")}
          value={convertToHourMinuteSecond(stats?.avgDurationPerSession || 0)}
          style={{ width: SCREEN_WIDTH / 2 - 20 }}
        />
        <Box
          label={t("sets_completed")}
          value={stats?.totalSetCount || 0}
          style={{ width: SCREEN_WIDTH / 2 - 20 }}
        />
      </View>

      <PlanStatsChart planId={item?.id} />
    </View>
  );
};
