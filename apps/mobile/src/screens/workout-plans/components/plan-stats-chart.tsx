import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../stores/redux-store";
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useGetWorkoutSessionsByPlanId } from "app/src/query/workout-session/workout-session.hooks";
import { Badge } from "../../../components/ui/badge";
import { Dimensions, View } from "react-native";
import { capitalize } from "lodash";
import { AppText } from "../../../components/ui/app-text";
import { BarChart } from "react-native-gifted-charts";
import { AppTouchable } from "../../../components/ui/app-touchable";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../../components/ui/expo-icon";
import {
  CategoryFilter,
  PeriodFilter,
  usePlanStatsChartData,
} from "../hooks/use-plan-stats-chart-data";

export const PlanStatsChart = ({
  planId,
}: {
  planId: string | undefined;
}) => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.app.theme);
  const [periodValue, setPeriodValue] = useState(dayjs().format("YYYY-MM-DD"));
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("month");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("weight");

  const { data: sessions } = useGetWorkoutSessionsByPlanId(planId!);
  // console.log("🚀 ~ sessions:", JSON.stringify(sessions, null, 2));

  const barData = usePlanStatsChartData(
    sessions,
    periodFilter,
    periodValue,
    categoryFilter
  );

  // const { data: sessions } = useGetWorkoutSessionsByPlanId(planId!);

  // console.log("🚀 ~ sessions:", JSON.stringify(sessions, null, 2));

  const chartTitle = useMemo(() => {
    const sum = barData.reduce((acc, b) => acc + (b.value || 0), 0);
    if (categoryFilter === "weight")
      return `${sum.toLocaleString()} ${t("kg")}`;
    if (categoryFilter === "reps")
      return `${sum.toLocaleString()} ${t("reps")}`;
    return `${sum.toFixed(1)} ${t("hour")}`;
  }, [barData, categoryFilter, t]);

  const changePeriod = useCallback(
    (dir: "prev" | "next") => {
      const unit = periodFilter === "year" ? "year" : "month";
      const next = dayjs(periodValue)[dir === "prev" ? "subtract" : "add"](
        1,
        unit
      );
      const iso = next.format("YYYY-MM-DD");
      // Bounds: not before 2024-01-01, not after today
      if (next.isBefore("2024-01-01") || next.isAfter(dayjs())) return;
      setPeriodValue(iso);
    },
    [periodFilter, periodValue]
  );

  return (
    <View>
      <View className="flex-row gap-3 my-4 pl-4">
        <Badge
          label={capitalize(t("weight"))}
          onPress={() => setCategoryFilter("weight")}
          isActive={categoryFilter === "weight"}
        />
        <Badge
          label={capitalize(t("reps"))}
          onPress={() => setCategoryFilter("reps")}
          isActive={categoryFilter === "reps"}
        />
        <Badge
          label={capitalize(t("duration"))}
          onPress={() => setCategoryFilter("time")}
          isActive={categoryFilter === "time"}
        />
      </View>
      <AppText className="text-2xl pl-4 font-semibold">{chartTitle}</AppText>
      <BarChart
        noOfSections={3}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        labelWidth={36}
        xAxisLabelTextStyle={{
          fontSize: 12,
          color: theme === "dark" ? "white" : "black",
        }}
        yAxisTextStyle={{
          fontSize: 12,
          color: theme === "dark" ? "white" : "black",
        }}
        width={Dimensions.get("window").width - 74}
        height={280}
      />

      <View className="flex-row my-4 pl-4">
        <AppTouchable
          onPress={() => {
            changePeriod("prev");
          }}
        >
          <ChevronLeftIcon />
        </AppTouchable>
        <AppText className="mx-auto">
          {periodFilter === "year"
            ? dayjs(periodValue).format("YYYY")
            : dayjs(periodValue).format("MM/YYYY")}
        </AppText>
        <AppTouchable
          onPress={() => {
            changePeriod("next");
          }}
        >
          <ChevronRightIcon />
        </AppTouchable>
      </View>

      <View className="flex-row gap-3 mt-4 pl-4">
        <Badge
          label={capitalize(t("month"))}
          onPress={() => {
            setPeriodValue(dayjs().format("YYYY-MM-DD"));
            setPeriodFilter("month");
          }}
          isActive={periodFilter === "month"}
        />
        <Badge
          label={capitalize(t("year"))}
          onPress={() => {
            setPeriodValue(dayjs().startOf("year").format("YYYY-MM-DD"));
            setPeriodFilter("year");
          }}
          isActive={periodFilter === "year"}
        />
      </View>
    </View>
  );
};
