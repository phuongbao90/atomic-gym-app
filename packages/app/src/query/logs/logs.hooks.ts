import { useQuery } from "@tanstack/react-query";
import { getWorkoutLogs } from "./logs.requests";
import { logsKeys } from "./logs.keys";

export const useWorkoutLogs = (periodType: string, periodValue: string) => {
  return useQuery({
    queryKey: logsKeys.workouts(periodType, periodValue),
    queryFn: () => getWorkoutLogs(periodType, periodValue),
    enabled: !!periodType && !!periodValue,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
