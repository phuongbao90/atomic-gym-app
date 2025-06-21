import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WORKOUT_SESSION_KEYS } from "./workout-session.keys";
import {
  createWorkoutSession,
  deleteWorkoutSession,
  deleteWorkoutSessionExercise,
  getMuscleGroupStats,
  getWorkoutSessionDetail,
  getWorkoutSessionHistory,
  getWorkoutSessionsByPlanId,
  updateWorkoutSession,
  updateWorkoutSessionExerciseSets,
} from "./workout-session.requests";
import { UpdateWorkoutSessionExerciseSetsBody } from "./workout-session.types";
import {
  CreateWorkoutSessionSchema,
  UpdateWorkoutSessionSchema,
} from "app-config";
import { z } from "zod";

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
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!id,
  });
};

export const useDeleteWorkoutSession = () => {
  return useMutation({
    mutationFn: (id: string) => deleteWorkoutSession(id),
  });
};

export const useDeleteWorkoutSessionExercise = () => {
  return useMutation({
    mutationFn: ({ id, exerciseId }: { id: string; exerciseId: string }) =>
      deleteWorkoutSessionExercise(id, exerciseId),
  });
};

export const useUpdateWorkoutSessionExerciseSets = () => {
  return useMutation({
    mutationFn: ({
      id,
      exerciseId,
      body,
    }: {
      id: string;
      exerciseId: string;
      body: UpdateWorkoutSessionExerciseSetsBody;
    }) => updateWorkoutSessionExerciseSets(id, exerciseId, body),
  });
};

export const useUpdateWorkoutSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: { id: string; body: z.infer<typeof UpdateWorkoutSessionSchema> }) =>
      updateWorkoutSession(id, body),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(WORKOUT_SESSION_KEYS.detail(id), data);
      // queryClient.invalidateQueries({
      //   queryKey: WORKOUT_SESSION_KEYS.detail(id),
      //   refetchType: "all",
      // });
    },
  });
};

export const useCreateWorkoutSession = () => {
  return useMutation({
    mutationFn: (body: z.infer<typeof CreateWorkoutSessionSchema>) =>
      createWorkoutSession(body),
  });
};

export const useGetWorkoutSessionsByPlanId = (id: string) => {
  return useQuery({
    queryKey: WORKOUT_SESSION_KEYS.plan(id),
    queryFn: () => getWorkoutSessionsByPlanId(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useGetMuscleGroupStats = (
  periodType: "week" | "month" | "year" | "all",
  periodValue: string
) => {
  return useQuery({
    queryKey: WORKOUT_SESSION_KEYS.muscleGroupStats(periodType, periodValue),
    queryFn: () => getMuscleGroupStats(periodType, periodValue),
    select: (data) => data.data,
    enabled: !!periodType && !!periodValue,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
