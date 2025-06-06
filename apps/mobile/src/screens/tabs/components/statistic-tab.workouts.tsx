import { RefreshControl, View } from "react-native";
import { AppText } from "../../../components/ui/app-text";
import { useCallback, useState } from "react";
import { useGetMuscleGroupStats, useWorkoutLogs } from "app";
import { Badge } from "../../../components/ui/badge";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../../components/ui/expo-icon";
import { useTranslation } from "react-i18next";
import { convertToHourMinuteSecond } from "../../../utils/convert-to-hour-minute-second";
import { Box } from "../../../components/box";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { convertSecondsToHours } from "../../../utils/convert-to-hour-minute-second";
import { PieChart } from "react-native-gifted-charts";

import { AppScrollView } from "../../../components/ui/app-scrollview";
import { capitalize } from "lodash";
import { AppTouchable } from "../../../components/ui/app-touchable";
import { Env } from "../../../configs/env";
import { Image } from "expo-image";

import { twColors } from "../../../styles/themes";
import { dayjs } from "../../../lib/dayjs";
import { useSetsPerMuscleGroupChartData } from "../hooks/use-sets-per-muscle-group-chart-data";

export const StatisticTabWorkouts = () => {
  const [periodType, setPeriodType] = useState<
    "week" | "month" | "year" | "all"
  >("month");
  const [periodValue, setPeriodValue] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const { t } = useTranslation();
  const { data, refetch, isRefetching } = useWorkoutLogs(
    periodType,
    periodValue
  );
  const { data: muscleGroupStats } = useGetMuscleGroupStats(
    periodType,
    periodValue
  );

  const chartProps = useSetsPerMuscleGroupChartData(muscleGroupStats);

  function handleChangePeriod(type: string, direction: "left" | "right") {
    if (type === "week") {
      const [start, end] = periodValue.split(",");
      const startOfCurrentWeek = dayjs(start).startOf("week");
      const endOfCurrentWeek = dayjs(end).endOf("week");

      const startOfPreviousWeek = startOfCurrentWeek.subtract(1, "week");
      const endOfPreviousWeek = endOfCurrentWeek.subtract(1, "week");

      const startOfNextWeek = startOfCurrentWeek.add(1, "week");
      const endOfNextWeek = endOfCurrentWeek.add(1, "week");

      if (direction === "left") {
        setPeriodValue(
          `${startOfPreviousWeek.format("YYYY-MM-DD")},${endOfPreviousWeek.format("YYYY-MM-DD")}`
        );
      } else {
        setPeriodValue(
          `${startOfNextWeek.format("YYYY-MM-DD")},${endOfNextWeek.format("YYYY-MM-DD")}`
        );
      }
    } else if (type === "month") {
      if (direction === "left") {
        setPeriodValue((prev) =>
          dayjs(prev).subtract(1, "month").format("YYYY-MM-DD")
        );
      } else {
        setPeriodValue((prev) =>
          dayjs(prev).add(1, "month").format("YYYY-MM-DD")
        );
      }
    } else if (type === "year") {
      if (direction === "left") {
        setPeriodValue((prev) =>
          dayjs(prev).subtract(1, "year").format("YYYY-MM-DD")
        );
      } else {
        setPeriodValue((prev) =>
          dayjs(prev).add(1, "year").format("YYYY-MM-DD")
        );
      }
    } else if (type === "all") {
    }
  }

  function renderPeriodValue() {
    if (periodType === "week") {
      const [start, end] = periodValue.split(",");
      return `${dayjs(start).format("DD MMM")} - ${dayjs(end).format("DD MMM")}`;
    }
    if (periodType === "month") {
      return dayjs(periodValue).format("MM/YYYY");
    }
    if (periodType === "year") {
      return dayjs(periodValue).format("YYYY");
    }
    return t("all");
  }

  const disableLeft = useCallback(() => {
    let disable = false;
    if (periodType === "week") {
      const [start] = periodValue.split(",");
      const startOfCurrentWeek = dayjs(start).startOf("week");
      const startOfLast = dayjs(Env.APP_START_DATE).startOf("week");

      if (startOfCurrentWeek.isBefore(startOfLast)) {
        disable = true;
      }
    }
    if (periodType === "month") {
      const current = dayjs(Env.APP_START_DATE).format("YYYY-MM");
      const period = dayjs(periodValue).format("YYYY-MM");

      if (period === current) {
        disable = true;
      }
    }

    if (periodType === "year") {
      const current = dayjs(Env.APP_START_DATE).format("YYYY");
      const period = dayjs(periodValue).format("YYYY");

      if (period === current) {
        disable = true;
      }
    }

    if (periodType === "all") {
      disable = true;
    }

    return disable;
  }, [periodType, periodValue]);

  const disableRight = useCallback(() => {
    let disable = false;

    if (periodType === "week") {
      const [start] = periodValue.split(",");
      const startOfCurrentWeek = dayjs(start).startOf("week");

      const startOfNextWeek = startOfCurrentWeek.add(1, "week");

      if (startOfNextWeek.isAfter(dayjs())) {
        disable = true;
      }
    }

    if (periodType === "month") {
      const current = dayjs().format("YYYY-MM");
      const period = dayjs(periodValue).format("YYYY-MM");

      if (period === current) {
        disable = true;
      }
    }

    if (periodType === "year") {
      const current = dayjs().format("YYYY");
      const period = dayjs(periodValue).format("YYYY");

      if (period === current) {
        disable = true;
      }
    }

    if (periodType === "all") {
      disable = true;
    }

    return disable;
  }, [periodType, periodValue]);

  return (
    <AppScrollView
      contentContainerStyle={{ paddingBottom: 60 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View className="flex-row items-center justify-center gap-2 mt-2">
        <Badge
          label={t("week")}
          onPress={() => {
            setPeriodType("week");

            const startOfWeek = dayjs().startOf("week");
            const endOfWeek = dayjs().endOf("week");
            setPeriodValue(
              `${startOfWeek.format("YYYY-MM-DD")},${endOfWeek.format("YYYY-MM-DD")}`
            );
          }}
          isActive={periodType === "week"}
        />
        <Badge
          label={t("month")}
          onPress={() => {
            setPeriodType("month");
            setPeriodValue(dayjs().format("YYYY-MM-DD"));
          }}
          isActive={periodType === "month"}
        />
        <Badge
          label={t("year")}
          onPress={() => {
            setPeriodType("year");
            setPeriodValue(dayjs().format("YYYY-MM-DD"));
          }}
          isActive={periodType === "year"}
        />
        <Badge
          label={t("all")}
          onPress={() => setPeriodType("all")}
          isActive={periodType === "all"}
        />
      </View>
      <View className="flex-row items-center justify-between my-6 mx-4">
        <AppTouchable
          onPress={() => handleChangePeriod(periodType, "left")}
          disabled={disableLeft()}
          debounceDelay={400}
        >
          <ChevronLeftIcon disabled={disableLeft()} />
        </AppTouchable>

        <AppText>{renderPeriodValue()}</AppText>
        <AppTouchable
          onPress={() => handleChangePeriod(periodType, "right")}
          disabled={disableRight()}
          debounceDelay={400}
        >
          <ChevronRightIcon disabled={disableRight()} />
        </AppTouchable>
      </View>

      <AppText className="text-2xl ml-4">{capitalize(t("general"))}</AppText>

      <View className=" mt-4 gap-y-4">
        <View className="flex-row flex-wrap gap-4 pl-4">
          <Box
            label={t("workout_sessions")}
            value={data?.data?.totalWorkouts}
            style={{ width: SCREEN_WIDTH / 2 - 20 }}
          />
          <Box
            label={t("total_time (hrs)")}
            value={convertSecondsToHours(data?.data?.totalDuration).toFixed(1)}
            style={{ width: SCREEN_WIDTH / 2 - 20 }}
          />
          <Box
            label={t("avg.session_duration")}
            value={convertToHourMinuteSecond(data?.data?.averageDuration || 0)}
            style={{ width: SCREEN_WIDTH / 2 - 20 }}
          />
          <Box
            label={t("sets_completed")}
            value={chartProps.totalSets}
            style={{ width: SCREEN_WIDTH / 2 - 20 }}
          />
        </View>
      </View>

      <View className="my-4 justify-center items-center">
        {chartProps.hasChartData ? (
          <PieChart
            {...chartProps}
            showText
            textColor="#ffffff"
            textSize={14}
            radius={150}
            donut
            innerCircleBorderWidth={10}
            innerCircleBorderColor={"rgba(255, 255, 255, 0.2)"}
            focusOnPress
            showTooltip
            persistTooltip
            tooltipWidth={100}
            tooltipComponent={(index: number) => {
              const item = chartProps?.data?.[index];
              return (
                <View className="flex-row gap-2 bg-slate-600 p-2 rounded-md z-50">
                  <View className="w-16 h-16 bg-slate-500">
                    {item?.image && (
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={item?.image}
                      />
                    )}
                  </View>
                  <View className="justify-center">
                    <AppText>{capitalize(t(item?.name))}</AppText>
                    <AppText>
                      {item?.value} {t("sets")}
                    </AppText>
                  </View>
                </View>
              );
            }}
            centerLabelComponent={() => {
              return (
                <AppText className="text-dark dark:text-dark text-center text-sm font-semibold">
                  {t("sets_per_muscle")}
                </AppText>
              );
            }}
          />
        ) : (
          <PieChart
            data={[{ value: 1, color: twColors.slate[400] }]}
            showText
            textColor="#ffffff"
            textSize={14}
            radius={150}
            donut
            innerCircleBorderWidth={10}
            innerCircleBorderColor={"rgba(255, 255, 255, 0.2)"}
            focusOnPress
            centerLabelComponent={() => {
              return (
                <AppText className="text-dark dark:text-dark text-center text-sm font-semibold">
                  {t("no_data")}
                </AppText>
              );
            }}
          />
        )}
      </View>
      <View className="flex-row flex-wrap gap-y-2">
        {chartProps?.data?.length > 0 &&
          chartProps?.data?.map((item) => {
            return (
              <View key={item.name} className="w-1/3">
                <ChartLegendItem item={item} />
              </View>
            );
          })}
      </View>
    </AppScrollView>
  );
};

const ChartLegendItem = ({
  item,
}: { item: { text: string; color: string; value: number; name: string } }) => {
  const { t } = useTranslation();
  return (
    <View className="flex-row gap-2 flex-1 justify-center ml-6">
      <View
        className="w-1 h-10 items-center"
        style={{ backgroundColor: item.color }}
      />
      <View className="flex-1">
        <AppText className="text-sm">{capitalize(t(item.name))}</AppText>
        <AppText className="text-sm">
          {item.value} {t("sets")}
        </AppText>
      </View>
    </View>
  );
};
