import { useMutation, useQuery } from "@tanstack/react-query";
import { WORKOUT_SESSION_KEYS } from "./workout-session.keys";
import {
  deleteWorkoutSession,
  getWorkoutSessionDetail,
  getWorkoutSessionHistory,
} from "./workout-session.requests";

export const useWorkoutSessionHistory = () => {
  return useQuery({
    queryKey: WORKOUT_SESSION_KEYS.history(),
    queryFn: getWorkoutSessionHistory,
    select: (data) => data.data,
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useWorkoutSessionDetail = (id: string) => {
  return useQuery({
    queryKey: WORKOUT_SESSION_KEYS.detail(id),
    queryFn: () => getWorkoutSessionDetail(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useDeleteWorkoutSession = () => {
  return useMutation({
    mutationFn: (id: string) => deleteWorkoutSession(id),
  });
};
