import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { WorkoutPlan } from "../../prisma-generated";
import { WorkoutPlanWithStats } from "../../types/extend-types";
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta";
import {
  CreateWorkoutPlanSchema,
  UpdateWorkoutPlanSchema,
  WorkoutPlanInGroups,
  WorkoutPlanQuery,
} from "./workout-plans.types";
import { z } from "zod";

export const getWorkoutPlans = async (query: WorkoutPlanQuery) => {
  // return request<ApiReponseWithMeta<WorkoutPlan[]>>(
  //   API_ROUTES.plans.query(query),
  //   {
  //     method: "GET",
  //   }
  // );

  return (await http
    .get(API_ROUTES.plans.query(query))
    .json()) as ApiReponseWithMeta<WorkoutPlan[]>;
};

export const getWorkoutPlan = async (id: string) => {
  // return request<
  //   ApiResponse<WorkoutPlanWithStats & { _count: { exercises: number } }>
  // >(API_ROUTES.plans.detail(id), {
  //   method: "GET",
  // });

  return (await http.get(API_ROUTES.plans.detail(id)).json()) as ApiResponse<
    WorkoutPlanWithStats & { _count: { exercises: number } }
  >;
};

export const getWorkoutPlansInGroups = async () => {
  return (await http
    .get(API_ROUTES.plans.inGroups)
    .json()) as ApiResponse<WorkoutPlanInGroups>;
};

export const createWorkoutPlan = async (
  data: z.infer<typeof CreateWorkoutPlanSchema>
) => {
  // return request<ApiResponse<WorkoutPlan>>(API_ROUTES.plans.base, {
  //   method: "POST",
  //   body: JSON.stringify(data),
  // });
  return (await http
    .url(API_ROUTES.plans.base)
    .post(data)
    .json()) as ApiResponse<WorkoutPlan>;
};

export const updateWorkoutPlan = async (
  data: z.infer<typeof UpdateWorkoutPlanSchema>
) => {
  // return request<ApiResponse<WorkoutPlan>>(API_ROUTES.plans.detail(data.id), {
  //   method: "PUT",
  //   body: JSON.stringify(data),
  // });

  return (await http
    .url(API_ROUTES.plans.detail(data.id))
    .put(data)
    .json()) as ApiResponse<WorkoutPlan>;
};

export const getWorkoutPlansByMe = async () => {
  // return request<ApiResponse<WorkoutPlan[]>>(API_ROUTES.plans.byMe, {
  //   method: "GET",
  // });

  return (await http.get(API_ROUTES.plans.byMe).json()) as ApiResponse<
    WorkoutPlan[]
  >;
};

export const getWorkoutPlansByUserId = async (userId: string) => {
  // return request<ApiResponse<WorkoutPlan[]>>(
  //   API_ROUTES.plans.byUserId(userId),
  //   {
  //     method: "GET",
  //   }
  // );

  return (await http
    .get(API_ROUTES.plans.byUserId(userId))
    .json()) as ApiResponse<WorkoutPlan[]>;
};
