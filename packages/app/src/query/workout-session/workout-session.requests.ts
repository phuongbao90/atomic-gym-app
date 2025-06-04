import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { ApiResponse } from "../../types/meta";
import {
  UpdateWorkoutSessionBody,
  UpdateWorkoutSessionExerciseSetsBody,
  WorkoutSessionDetail,
  WorkoutSessionHistoryItem,
} from "./workout-session.types";

export const getWorkoutSessionHistory = async () => {
  return (await http
    .get(API_ROUTES.workoutSession.history())
    .json()) as ApiResponse<WorkoutSessionHistoryItem[]>;
};

export const getWorkoutSessionDetail = async (id: string) => {
  return (await http
    .get(API_ROUTES.workoutSession.detail(id))
    .json()) as ApiResponse<WorkoutSessionDetail>;
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
  body: UpdateWorkoutSessionBody
) => {
  return (await http
    .url(API_ROUTES.workoutSession.update(id))
    .put(body)
    .json()) as ApiResponse<boolean>;
};
