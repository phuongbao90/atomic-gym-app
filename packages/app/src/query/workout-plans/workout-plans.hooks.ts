import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  createWorkoutPlan,
  getWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlansByMe,
  getWorkoutPlansInGroups,
  getWorkoutPlanStats,
  updateWorkoutPlan,
} from "./workout-plans.requests";
import { useAppInfiniteQuery } from "../helpers";
import { WorkoutPlanQuery } from "./workout-plans.types";
import { workoutPlanKeys } from "./workout-plans.keys";
import { z } from "zod";
import { WorkoutPlan } from "../../prisma-generated";
import { ApiResponse } from "../..";
import {
  CreateWorkoutPlanBodySchema,
  UpdateWorkoutPlanBodySchema,
  WorkoutPlanItemResponseSchema,
} from "app-config";

export const useGetWorkoutPlans = (query: WorkoutPlanQuery) => {
  return useAppInfiniteQuery({
    queryKey: workoutPlanKeys.list(query),
    queryFn: ({ pageParam = 1 }) =>
      getWorkoutPlans({ ...query, page: pageParam as number }),
  });
};

export const useGetWorkoutPlansByMe = (
  options?: Pick<
    UseQueryOptions<
      ApiResponse<z.infer<typeof WorkoutPlanItemResponseSchema>[]>,
      Error,
      z.infer<typeof WorkoutPlanItemResponseSchema>[]
    >,
    "enabled"
  >
) => {
  return useQuery({
    queryKey: workoutPlanKeys.listByMe(),
    queryFn: () => getWorkoutPlansByMe(),
    select: (data) => data?.data,
    ...options,
  });
};

export const useGetWorkoutPlan = (id: string | undefined) => {
  return useQuery({
    queryKey: workoutPlanKeys.detail(id!),
    queryFn: () => getWorkoutPlan(id!),
    select: (data) => data?.data,
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
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
    mutationFn: (data: z.infer<typeof CreateWorkoutPlanBodySchema>) =>
      createWorkoutPlan(data),
  });
};

export const useUpdateWorkoutPlan = () => {
  return useMutation({
    mutationFn: (data: z.infer<typeof UpdateWorkoutPlanBodySchema>) =>
      updateWorkoutPlan(data),
  });
};

export const useGetWorkoutPlanStats = (id: string) => {
  return useQuery({
    queryKey: workoutPlanKeys.stats(id),
    queryFn: () => getWorkoutPlanStats(id),
    select: (data) => data?.data,
    enabled: !!id,
  });
};
