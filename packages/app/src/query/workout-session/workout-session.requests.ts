import {
  CreateWorkoutSessionSchema,
  UpdateWorkoutSessionSchema,
  WorkoutSessionHistoryDetailSchema,
  WorkoutSessionHistoryItemSchema,
  WorkoutSessionsOfPlanSchema,
} from "app-config";
import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { ApiResponse } from "../../types/meta";
import { UpdateWorkoutSessionExerciseSetsBody } from "./workout-session.types";
import { z } from "zod";

export const getWorkoutSessionHistory = async () => {
  return (await http
    .get(API_ROUTES.workoutSession.history())
    .json()) as ApiResponse<z.infer<typeof WorkoutSessionHistoryItemSchema>[]>;
};

export const getWorkoutSessionDetail = async (id: string) => {
  return (await http
    .get(API_ROUTES.workoutSession.detail(id))
    .json()) as ApiResponse<z.infer<typeof WorkoutSessionHistoryDetailSchema>>;
};

export const deleteWorkoutSession = async (id: string) => {
  return (await http
    .delete(API_ROUTES.workoutSession.delete(id))
    .json()) as ApiResponse<boolean>;
};

export const deleteWorkoutSessionExercise = async (
  id: string,
  exerciseId: string
) => {
  return (await http
    .delete(API_ROUTES.workoutSession.deleteExercise(id, exerciseId))
    .json()) as ApiResponse<boolean>;
};

export const updateWorkoutSessionExerciseSets = async (
  id: string,
  exerciseId: string,
  body: UpdateWorkoutSessionExerciseSetsBody
) => {
  return (await http
    .url(API_ROUTES.workoutSession.updateExerciseSets(id, exerciseId))
    .put(body)
    .json()) as ApiResponse<boolean>;
};

export const updateWorkoutSession = async (
  id: string,
  body: z.infer<typeof UpdateWorkoutSessionSchema>
) => {
  return (await http
    .url(API_ROUTES.workoutSession.update(id))
    .put(body)
    .json()) as ApiResponse<z.infer<typeof WorkoutSessionHistoryDetailSchema>>;
};

export const createWorkoutSession = async (
  body: z.infer<typeof CreateWorkoutSessionSchema>
) => {
  return (await http
    .url(API_ROUTES.workoutSession.create())
    .post(body)
    .json()) as ApiResponse<z.infer<typeof WorkoutSessionHistoryDetailSchema>>;
};

export const getWorkoutSessionsByPlanId = async (id: string) => {
  return (await http
    .get(API_ROUTES.workoutSession.plan(id))
    .json()) as ApiResponse<z.infer<typeof WorkoutSessionsOfPlanSchema>[]>;
};

export const getMuscleGroupStats = async (
  periodType: string,
  periodValue: string
) => {
  return (await http
    .get(API_ROUTES.workoutSession.muscleGroupStats(periodType, periodValue))
    .json()) as ApiResponse<Record<string, number>>;
};
