import { useMutation, useQuery } from "@tanstack/react-query";
import { WORKOUT_SESSION_KEYS } from "./workout-session.keys";
import {
  deleteWorkoutSession,
  deleteWorkoutSessionExercise,
  getWorkoutSessionDetail,
  getWorkoutSessionHistory,
  updateWorkoutSession,
  updateWorkoutSessionExerciseSets,
} from "./workout-session.requests";
import {
  UpdateWorkoutSessionBody,
  UpdateWorkoutSessionExerciseSetsBody,
} from "./workout-session.types";

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
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: { id: string; body: UpdateWorkoutSessionBody }) =>
      updateWorkoutSession(id, body),
  });
};
