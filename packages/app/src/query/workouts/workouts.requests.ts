import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { Workout } from "../../prisma-generated";
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta";
import { WorkoutQuery } from "./workouts.types";

export const getWorkouts = async (query: WorkoutQuery & { page: number }) => {
  // return request<ApiReponseWithMeta<Workout[]>>(
  //   API_ROUTES.workouts.query(query),
  //   {
  //     method: "GET",
  //   }
  // );

  return (await http
    .get(API_ROUTES.workouts.query(query))
    .json()) as ApiReponseWithMeta<Workout[]>;
};

export const getWorkout = async (id: string) => {
  // return request<ApiResponse<Workout>>(API_ROUTES.workouts.detail(id), {
  //   method: "GET",
  // });

  return (await http
    .get(API_ROUTES.workouts.detail(id))
    .json()) as ApiResponse<Workout>;
};

export const getWorkoutsByWorkoutPlanId = async (planId: string) => {
  // return request<ApiReponseWithMeta<Workout[]>>(
  //   API_ROUTES.workouts.byWorkoutPlanId(planId),
  //   {
  //     method: "GET",
  //   }
  // );

  return (await http
    .get(API_ROUTES.workouts.byWorkoutPlanId(planId))
    .json()) as ApiReponseWithMeta<Workout[]>;
};
