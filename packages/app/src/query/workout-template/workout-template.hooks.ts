import { useAppInfiniteQuery } from "../helpers";
import {
  getWorkoutTemplate,
  getWorkoutTemplates,
  getWorkoutTemplatesByWorkoutPlanId,
} from "./workout-template.requests";
import { WorkoutQuery } from "./workout-template.types";
import { useQuery } from "@tanstack/react-query";
import { workoutKeys } from "./workout-template.keys";

export const useGetWorkoutTemplates = (query: WorkoutQuery) => {
  return useAppInfiniteQuery({
    queryKey: workoutKeys.list(query),
    queryFn: ({ pageParam = 1 }) =>
      getWorkoutTemplates({ ...query, page: pageParam as number }),
  });
};

export const useGetWorkoutTemplate = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: workoutKeys.detail(id),
    queryFn: () => getWorkoutTemplate(id),
    select: (data) => data.data,
  });
};

export const useGetWorkoutTemplatesByWorkoutPlanId = (planId: string) => {
  return useQuery({
    queryKey: workoutKeys.listByWorkoutPlanId(planId),
    queryFn: () => getWorkoutTemplatesByWorkoutPlanId(planId),
    enabled: !!planId,
    select: (data) => data.data,
  });
};
