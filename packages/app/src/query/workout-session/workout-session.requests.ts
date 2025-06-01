import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { ApiResponse } from "../../types/meta";
import { WorkoutSessionHistoryItem } from "./workout-session.types";

export const getWorkoutSessionHistory = async () => {
  return (await http
    .get(API_ROUTES.workoutSession.history())
    .json()) as ApiResponse<WorkoutSessionHistoryItem[]>;
};
