import { useQuery } from "@tanstack/react-query";
import { WORKOUT_SESSION_KEYS } from "./workout-session.keys";
import { getWorkoutSessionHistory } from "./workout-session.requests";

export const useWorkoutSessionHistory = () => {
  return useQuery({
    queryKey: WORKOUT_SESSION_KEYS.history(),
    queryFn: getWorkoutSessionHistory,
    select: (data) => data.data,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
