import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { ApiResponse } from "../../types/meta";
import { WorkoutLogResponse } from "./logs.types";

export const getWorkoutLogs = async (
  periodType: string,
  periodValue: string
) => {
  return (await http
    .get(API_ROUTES.logs.workouts(periodType, periodValue))
    .json()) as ApiResponse<WorkoutLogResponse>;
};
