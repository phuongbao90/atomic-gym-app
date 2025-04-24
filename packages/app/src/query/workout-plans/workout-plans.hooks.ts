import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createWorkoutPlan,
  getWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlansInGroups,
  updateWorkoutPlan,
} from "./workout-plans.requests";
import { useAppInfiniteQuery } from "../helpers";
import {
  CreateWorkoutPlanSchema,
  UpdateWorkoutPlanSchema,
  WorkoutPlanQuery,
} from "./workout-plans.types";
import { workoutPlanKeys } from "./workout-plans.keys";
import { z } from "zod";

export const useGetWorkoutPlans = (query: WorkoutPlanQuery) => {
  return useAppInfiniteQuery({
    queryKey: workoutPlanKeys.list(query),
    queryFn: ({ pageParam = 1 }) =>
      getWorkoutPlans({ ...query, page: pageParam as number }),
  });
};

export const useGetWorkoutPlan = (id: string | undefined) => {
  return useQuery({
    queryKey: workoutPlanKeys.detail(id!),
    queryFn: () => getWorkoutPlan(id!),
    select: (data) => data?.data,
    enabled: !!id,
  });
};

export const useGetWorkoutPlansInGroups = () => {
  return useQuery({
    queryKey: workoutPlanKeys.inGroups(),
    queryFn: () => getWorkoutPlansInGroups(),
    select: (data) => data?.data,
  });
};

export const useCreateWorkoutPlan = () => {
  return useMutation({
    mutationFn: (data: z.infer<typeof CreateWorkoutPlanSchema>) =>
      createWorkoutPlan(data),
  });
};

export const useUpdateWorkoutPlan = () => {
  return useMutation({
    mutationFn: (data: z.infer<typeof UpdateWorkoutPlanSchema>) =>
      updateWorkoutPlan(data),
  });
};
