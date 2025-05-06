import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { WorkoutPlanWithStats } from "app";
import { View } from "react-native";
import { AppText } from "../../../components/ui/app-text";
import { useTranslation } from "react-i18next";
import {
  convertSecondsToHours,
  convertToHourMinuteSecond,
} from "../../../utils/convert-to-hour-minute-second";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { useCallback, useMemo, useState } from "react";
import { AppTouchable } from "../../../components/ui/app-touchable";
import { cn } from "../../../utils/cn";
import { capitalize, template } from "lodash";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../../components/ui/expo-icon";
import { dayjs } from "../../../lib/dayjs";

type PeriodFilter = "month" | "year";
type CategoryFilter = "weight" | "reps" | "time";
type Week = {
  totalWeight: number;
  totalReps: number;
  totalDistance: number;
  totalDuration: number;
  weekStart: string;
};
type GroupedByWeek = Record<string, Week>;

function createIsoWeekTemplate(startYear: number, endYear: number) {
  const template: Record<
    string,
    {
      totalWeight: number;
      totalReps: number;
      totalDistance: number;
      totalDuration: number;
      weekStart: string;
    }
  > = {};
  for (let year = startYear; year <= endYear; year++) {
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

const pickWeeksInMonth = (
  groupedByWeek: GroupedByWeek,
  year: number,
  month: number
) => {
  const monthStart = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
  const monthEnd = monthStart.endOf("month");

  return Object.values(groupedByWeek)
    .filter((week) => {
      const start = dayjs(week.weekStart);
      const end = start.add(6, "day"); // ISO-week is 7 days long

      return end.isAfter(monthStart) && start.isBefore(monthEnd);
    })
    .sort(
      (a, b) => dayjs(a.weekStart).valueOf() - dayjs(b.weekStart).valueOf()
    );
};

const pickWeeksInYear = (groupedByWeek: GroupedByWeek, year: number) => {
  const yearStart = dayjs(`${year}-01-01`);
  const yearEnd = dayjs(`${year}-12-31`);

  return Object.values(groupedByWeek)
    .filter((week) => {
      const start = dayjs(week.weekStart);
      const end = start.add(6, "day");
      return end.isAfter(yearStart) && start.isBefore(yearEnd);
    })
    .sort(
      (a, b) => dayjs(a.weekStart).valueOf() - dayjs(b.weekStart).valueOf()
    );
};

const spacingMap = {
  week: 10,
  month: 10,
  year: 1,
} as const;

const barWidthMap = ({ count, type }: { count: number; type: PeriodFilter }) =>
  ({
    week: 50,
    month: count === 5 ? 60 : 49,
    year: 5,
  })[type];

export const WorkoutPlanStatistics = ({
  item,
}: {
  item: WorkoutPlanWithStats | undefined;
}) => {
  const { t } = useTranslation();
  const [periodValue, setPeriodValue] = useState(dayjs().format("YYYY-MM-DD"));
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("month");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("weight");

  const barData = useMemo(() => {
    if (!item?.WorkoutSessionLog || item?.WorkoutSessionLog.length === 0)
      return [];

    const template = createIsoWeekTemplate(2024, dayjs().year());

    item?.WorkoutSessionLog?.forEach((session) => {
      const weekStart = dayjs(session.createdAt)
        .startOf("isoWeek")
        .format("YYYY-MM-DD");

      if (template[weekStart]) {
        template[weekStart].totalWeight +=
          session.setLogs?.reduce((sum, s) => sum + (s.weight || 0), 0) || 0;
        template[weekStart].totalReps +=
          session.setLogs?.reduce((sum, s) => sum + (s.repetitions || 0), 0) ||
          0;
        template[weekStart].totalDistance +=
          session.setLogs?.reduce((sum, s) => sum + (s.distance || 0), 0) || 0;
        template[weekStart].totalDuration +=
          session.setLogs?.reduce(
            (sum, s) =>
              sum + (Number(convertSecondsToHours(s.duration || 0)) || 0),
            0
          ) || 0;
      }
    });

    let weeks: Week[] = [];

    if (periodFilter === "year") {
      const year = dayjs(periodValue).year();
      weeks = pickWeeksInYear(template, year);
    }
    if (periodFilter === "month") {
      const month = dayjs(periodValue).month() + 1;

      const year = dayjs(periodValue).year();
      weeks = pickWeeksInMonth(template, year, month);
    }

    return weeks.map((week, index) => ({
      value:
        categoryFilter === "weight"
          ? week.totalWeight
          : categoryFilter === "reps"
            ? week.totalReps
            : Number(week.totalDuration.toFixed(1)),
      spacing: spacingMap[periodFilter],
      label:
        periodFilter === "month"
          ? dayjs(week.weekStart).format("DD/MM")
          : periodFilter === "year"
            ? index === 0 ||
              index === Math.floor(weeks.length / 4) ||
              index === Math.floor(weeks.length / 4) * 2 ||
              index === Math.floor(weeks.length / 4) * 3 ||
              index === weeks.length - 1
              ? dayjs(week.weekStart).format("DD/MM")
              : ""
            : "",
      barWidth: barWidthMap({
        count: weeks.length,
        type: periodFilter,
      }),
    }));
  }, [periodFilter, categoryFilter, item?.WorkoutSessionLog, periodValue]);

  const chartTitle = useCallback(() => {
    const value = barData?.reduce((sum, bar) => sum + (bar.value || 0), 0);

    if (categoryFilter === "weight") {
      return `${Number(value).toLocaleString()} ${t("kg")}`;
    }

    if (categoryFilter === "reps") {
      return `${Number(value).toLocaleString()} ${t("reps")}`;
    }

    if (categoryFilter === "time") {
      return `${(value).toFixed(1)} ${t("hour")}`;
    }

    return "";
  }, [barData, categoryFilter, t]);

  return (
    <View className=" mt-4 gap-y-4">
      <View className="flex-row flex-wrap gap-4 pl-4">
        <Pill label={t("workout_sessions")} value={item?.stats?.sessionCount} />
        <Pill
          label={t("total_time (hrs)")}
          value={convertSecondsToHours(item?.stats?.totalDuration).toFixed(1)}
        />
        <Pill
          label={t("avg.session_duration")}
          value={convertToHourMinuteSecond(
            item?.stats?.avgDurationPerSession || 0
          )}
        />
        <Pill label={t("sets_completed")} value={item?.stats?.totalSetCount} />
      </View>

      <View>
        <View className="flex-row gap-3 my-4 pl-4">
          <FilterButton
            label={t("weight")}
            onPress={() => setCategoryFilter("weight")}
            isActive={categoryFilter === "weight"}
          />
          <FilterButton
            label={t("reps")}
            onPress={() => setCategoryFilter("reps")}
            isActive={categoryFilter === "reps"}
          />
          <FilterButton
            label={t("duration")}
            onPress={() => setCategoryFilter("time")}
            isActive={categoryFilter === "time"}
          />
        </View>
        <AppText className="text-2xl pl-4 font-semibold">
          {chartTitle()}
        </AppText>
        <BarChart
          noOfSections={3}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          labelWidth={36}
          xAxisLabelTextStyle={{ fontSize: 12 }}
          yAxisTextStyle={{ fontSize: 12 }}
          height={280}
        />

        <View className="flex-row my-4 pl-4">
          <AppTouchable
            onPress={() => {
              const nextPeriod = dayjs(periodValue)
                .subtract(1, periodFilter === "year" ? "year" : "month")
                .format("YYYY-MM");
              const year = dayjs(nextPeriod).year();

              if (periodFilter === "year") {
                if (year < 2024) return;
                setPeriodValue(nextPeriod);
              }
              if (periodFilter === "month") {
                if (dayjs(nextPeriod).isBefore(dayjs("2024-01-01"))) return;
                setPeriodValue(nextPeriod);
              }
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
              const nextPeriod = dayjs(periodValue)
                .add(1, periodFilter === "year" ? "year" : "month")
                .format("YYYY-MM");
              const year = dayjs(nextPeriod).year();

              if (periodFilter === "year") {
                // if (year > dayjs().year()) return;
                setPeriodValue(nextPeriod);
              }
              if (periodFilter === "month") {
                // if (dayjs(nextPeriod).isAfter(dayjs())) return;
                setPeriodValue(nextPeriod);
              }
            }}
          >
            <ChevronRightIcon />
          </AppTouchable>
        </View>

        <View className="flex-row gap-3 mt-4 pl-4">
          <FilterButton
            label={t("month")}
            onPress={() => {
              setPeriodValue(dayjs().format("YYYY-MM-DD"));
              setPeriodFilter("month");
            }}
            isActive={periodFilter === "month"}
          />
          <FilterButton
            label={t("year")}
            onPress={() => {
              setPeriodValue(dayjs().startOf("year").format("YYYY-MM-DD"));
              setPeriodFilter("year");
            }}
            isActive={periodFilter === "year"}
          />
        </View>
      </View>
    </View>
  );
};

const Pill = ({
  label,
  value,
}: { label: string; value: number | undefined | string }) => {
  return (
    <View
      className="gap-2 bg-slate-200 rounded-lg p-4"
      style={{ width: SCREEN_WIDTH / 2 - 20 }}
    >
      <AppText className="text-lg">{label}</AppText>
      <AppText className="text-3xl mt-auto">{value ? value : ""}</AppText>
    </View>
  );
};

const FilterButton = ({
  label,
  onPress,
  isActive,
}: { label: string; onPress: () => void; isActive: boolean }) => {
  return (
    <AppTouchable
      onPress={onPress}
      className={cn({
        "bg-primary border-none": isActive,
        "bg-white border border-gray-300": !isActive,
        "rounded-lg py-2 px-4": true,
      })}
    >
      <AppText
        className={cn({
          "text-dark": true,
        })}
      >
        {capitalize(label)}
      </AppText>
    </AppTouchable>
  );
};
