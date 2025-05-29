import { WorkoutPlanWithStats, WorkoutSessionLog } from "app";
import { Dimensions, View } from "react-native";
import { AppText } from "../../../components/ui/app-text";
import { useTranslation } from "react-i18next";
import {
  convertSecondsToHours,
  convertToHourMinuteSecond,
} from "../../../utils/convert-to-hour-minute-second";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { useCallback, useMemo, useState } from "react";
import { AppTouchable } from "../../../components/ui/app-touchable";
import { capitalize } from "lodash";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../../components/ui/expo-icon";
import { dayjs } from "../../../lib/dayjs";
import { useAppSelector } from "../../../stores/redux-store";
import { Badge } from "../../../components/ui/badge";
import { Box } from "../../../components/box";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

type PeriodFilter = "month" | "year";
type CategoryFilter = "weight" | "reps" | "time";
type WeekStats = {
  totalWeight: number;
  totalReps: number;
  totalDistance: number;
  totalDuration: number;
  weekStart: string;
};

function createIsoWeekTemplate(startYear: number) {
  const template: Record<string, WeekStats> = {};

  for (let year = startYear; year <= dayjs().year(); year++) {
    const yearStart = dayjs(`${year}-01-01`);
    const yearEnd = dayjs(`${year}-12-31`);
    let current = yearStart.startOf("isoWeek");
    while (current.isBefore(yearEnd)) {
      const weekStart = current.format("YYYY-MM-DD");
      if (!template[weekStart]) {
        template[weekStart] = {
          totalWeight: 0,
          totalReps: 0,
          totalDistance: 0,
          totalDuration: 0,
          weekStart,
        };
      }
      current = current.add(1, "week");
    }
  }
  return template;
}

// Unified helper to pick ISO-weeks for month or ISO-year
const pickWeeks = (
  grouped: Record<string, WeekStats>,
  periodFilter: PeriodFilter,
  periodValue: string
) => {
  const year = dayjs(periodValue).year();
  if (periodFilter === "year") {
    return Object.values(grouped)
      .filter(({ weekStart }) => dayjs(weekStart).isoWeekYear() === year)
      .sort(
        (a, b) => dayjs(a.weekStart).valueOf() - dayjs(b.weekStart).valueOf()
      );
  }

  // Month view …
  const month = dayjs(periodValue).month() + 1;
  const spanStart = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
  const spanEnd = spanStart.endOf("month");
  return Object.values(grouped)
    .filter(({ weekStart }) => {
      const start = dayjs(weekStart);
      const end = start.add(6, "day");
      return (
        end.isSameOrAfter(spanStart, "day") &&
        start.isSameOrBefore(spanEnd, "day")
      );
    })
    .sort(
      (a, b) => dayjs(a.weekStart).valueOf() - dayjs(b.weekStart).valueOf()
    );
};

const spacingMap = {
  month: 10,
  year: 1,
} as const;

const barWidthMap = (count: number, type: PeriodFilter) =>
  ({
    month: count === 5 ? 60 : 49,
    year: 5,
  })[type];

// Custom hook
const useBarData = (
  sessions: WorkoutSessionLog[] | undefined,
  periodFilter: PeriodFilter,
  periodValue: string,
  category: CategoryFilter
): barDataItem[] =>
  useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    // ISO-week buckets for the target year
    const year = dayjs(periodValue).year();
    const buckets = createIsoWeekTemplate(year);

    // Accumulate
    sessions.forEach(({ createdAt, setLogs, duration }) => {
      const key = dayjs(createdAt).startOf("isoWeek").format("YYYY-MM-DD");
      const bucket = buckets[key];
      if (!bucket) return;
      const weight = setLogs?.reduce((sum, s) => sum + (s.weight || 0), 0) || 0;
      const reps =
        setLogs?.reduce((sum, s) => sum + (s.repetitions || 0), 0) || 0;

      bucket.totalWeight += weight;
      bucket.totalReps += reps;
      bucket.totalDuration += Number(convertSecondsToHours(duration));
    });

    // Filter relevant weeks
    const weeks = pickWeeks(buckets, periodFilter, periodValue);

    // Map to BarData
    return weeks.map((w, idx) => {
      const raw =
        category === "weight"
          ? w.totalWeight
          : category === "reps"
            ? w.totalReps
            : w.totalDuration;

      // Label logic
      let label = "";
      if (periodFilter === "month") {
        label = dayjs(w.weekStart).format("DD/MM");
      } else {
        const ticks = Math.floor(weeks.length / 4);
        if ([0, ticks, ticks * 2, ticks * 3, weeks.length - 1].includes(idx)) {
          label = dayjs(w.weekStart).format("DD/MM");
        }
      }

      return {
        value: raw,
        spacing: spacingMap[periodFilter],
        label,
        barWidth: barWidthMap(weeks.length, periodFilter),
      };
    });
  }, [sessions, periodFilter, periodValue, category]);

export const WorkoutPlanStatistics = ({
  item,
}: {
  item: WorkoutPlanWithStats | undefined;
}) => {
  const { t } = useTranslation();

  return (
    <View className=" mt-4 gap-y-4">
      <View className="flex-row flex-wrap gap-4 pl-4">
        <Box
          label={t("workout_sessions")}
          value={item?.stats?.sessionCount}
          style={{ width: SCREEN_WIDTH / 2 - 20 }}
        />
        <Box
          label={t("total_time (hrs)")}
          value={convertSecondsToHours(item?.stats?.totalDuration).toFixed(1)}
          style={{ width: SCREEN_WIDTH / 2 - 20 }}
        />
        <Box
          label={t("avg.session_duration")}
          value={convertToHourMinuteSecond(
            item?.stats?.avgDurationPerSession || 0
          )}
          style={{ width: SCREEN_WIDTH / 2 - 20 }}
        />
        <Box
          label={t("sets_completed")}
          value={item?.stats?.totalSetCount}
          style={{ width: SCREEN_WIDTH / 2 - 20 }}
        />
      </View>

      <Chart item={item} />
    </View>
  );
};

const Chart = ({
  item,
}: {
  item: WorkoutPlanWithStats | undefined;
}) => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.app.theme);
  const [periodValue, setPeriodValue] = useState(dayjs().format("YYYY-MM-DD"));
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("month");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("weight");

  const barData = useBarData(
    item?.WorkoutSessionLog,
    periodFilter,
    periodValue,
    categoryFilter
  );

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
