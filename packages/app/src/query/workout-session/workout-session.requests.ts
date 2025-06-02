import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { ApiResponse } from "../../types/meta";
import {
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
