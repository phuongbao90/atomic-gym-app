import { WorkoutSessionsOfPlanSchema } from "app-config/src/types/workout-session-schema";
import { useMemo } from "react";
import { barDataItem } from "react-native-gifted-charts";
import { z } from "zod";
import { dayjs } from "../../../lib/dayjs";
import { convertSecondsToHours } from "../../../utils/convert-to-hour-minute-second";

export type PeriodFilter = "month" | "year";
export type CategoryFilter = "weight" | "reps" | "time";

type WeekStats = {
  totalWeight: number;
  totalReps: number;
  totalDistance: number;
  totalDuration: number;
  weekStart: string;
};

export const usePlanStatsChartData = (
  sessions: z.infer<typeof WorkoutSessionsOfPlanSchema>[] | undefined,
  periodFilter: PeriodFilter,
  periodValue: string,
  category: CategoryFilter
): barDataItem[] =>
  useMemo(() => {
    if (!sessions || sessions.length === 0) return [];
    // console.log(periodFilter, periodValue, category);

    // ISO-week buckets for the target year
    const year = dayjs(periodValue).year();
    const buckets = createIsoWeekTemplate(year);

    // Accumulate
    sessions.forEach(({ completedAt, sessionExercises, duration }) => {
      const key = dayjs(completedAt).startOf("isoWeek").format("YYYY-MM-DD");
      const bucket = buckets[key];
      if (!bucket) return;
      const weight =
        sessionExercises?.reduce(
          (sum, s) =>
            sum +
            (s.performedSets.reduce((sum, s) => sum + (s.weight || 0), 0) || 0),
          0
        ) || 0;
      const reps =
        sessionExercises?.reduce(
          (sum, s) =>
            sum +
            (s.performedSets.reduce((sum, s) => sum + (s.reps || 0), 0) || 0),
          0
        ) || 0;

      bucket.totalWeight += weight;
      bucket.totalReps += reps;
      bucket.totalDuration += Number(convertSecondsToHours(duration || 0));
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

const spacingMap = {
  month: 10,
  year: 1,
} as const;

const barWidthMap = (count: number, type: PeriodFilter) =>
  ({
    month: count === 5 ? 60 : 49,
    year: 5,
  })[type];

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
