import { useQuery } from "@tanstack/react-query";
import {
  getWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlansInGroups,
} from "./workout-plans.requests";
import { useAppInfiniteQuery } from "../helpers";
import { WorkoutPlanQuery } from "./workout-plans.types";
import { workoutPlanKeys } from "./workout-plans.keys";

export const useGetWorkoutPlans = (query: WorkoutPlanQuery) => {
  return useAppInfiniteQuery({
    queryKey: workoutPlanKeys.list(query),
    queryFn: ({ pageParam = 1 }) =>
      getWorkoutPlans({ ...query, page: pageParam as number }),
  });
};

export const useGetWorkoutPlan = (id: number) => {
  return useQuery({
    queryKey: workoutPlanKeys.detail(id),
    queryFn: () => getWorkoutPlan(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useGetWorkoutPlansInGroups = () => {
  return useQuery({
    queryKey: workoutPlanKeys.inGroups(),
    queryFn: () => getWorkoutPlansInGroups(),
    select: (data) => data.data,
  });
};
