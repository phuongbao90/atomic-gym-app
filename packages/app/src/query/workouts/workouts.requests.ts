import { API_ROUTES } from "../../configs/api-routes";
import { request } from "../../libs/request";
import { Workout } from "../../prisma-generated";
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta";
import { WorkoutQuery } from "./workouts.types";

export const getWorkouts = (query: WorkoutQuery & { page: number }) => {
  return request<ApiReponseWithMeta<Workout[]>>(
    API_ROUTES.workouts.query(query),
    {
      method: "GET",
    }
  );
};

export const getWorkout = (id: string) => {
  return request<ApiResponse<Workout>>(API_ROUTES.workouts.detail(id), {
    method: "GET",
  });
};

export const getWorkoutsByWorkoutPlanId = (planId: string) => {
  return request<ApiReponseWithMeta<Workout[]>>(
    API_ROUTES.workouts.byWorkoutPlanId(planId),
    {
      method: "GET",
    }
  );
};
