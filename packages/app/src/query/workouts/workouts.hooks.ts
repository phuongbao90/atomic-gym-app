import { useAppInfiniteQuery } from "../helpers";
import {
  getWorkout,
  getWorkouts,
  getWorkoutsByWorkoutPlanId,
} from "./workouts.requests";
import { WorkoutQuery } from "./workouts.types";
import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "./workouts.keys";

export const useGetWorkouts = (query: WorkoutQuery) => {
  return useAppInfiniteQuery({
    queryKey: workoutKeys.list(query),
    queryFn: ({ pageParam = 1 }) =>
      getWorkouts({ ...query, page: pageParam as number }),
  });
};

export const useGetWorkout = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: workoutKeys.detail(id),
    queryFn: () => getWorkout(id),
    select: (data) => data.data,
  });
};

export const useGetWorkoutsByWorkoutPlanId = (planId: string) => {
  return useQuery({
    queryKey: workoutKeys.listByWorkoutPlanId(planId),
    queryFn: () => getWorkoutsByWorkoutPlanId(planId),
    enabled: !!planId,
    select: (data) => data.data,
  });
};
