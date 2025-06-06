import {
  CreateWorkoutPlanBodySchema,
  UpdateWorkoutPlanBodySchema,
  WorkoutPlanItemResponseSchema,
  WorkoutPlanStatsResponseSchema,
} from "app-config";
import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta";
import { WorkoutPlanQuery } from "./workout-plans.types";
import z from "zod";

export const getWorkoutPlans = async (query: WorkoutPlanQuery) => {
  return (await http
    .get(API_ROUTES.plans.query(query))
    .json()) as ApiReponseWithMeta<
    z.infer<typeof WorkoutPlanItemResponseSchema>[]
  >;
};

export const getWorkoutPlan = async (id: string) => {
  return (await http.get(API_ROUTES.plans.detail(id)).json()) as ApiResponse<
    z.infer<typeof WorkoutPlanItemResponseSchema>
  >;
};

export const getWorkoutPlansInGroups = async () => {
  return (await http.get(API_ROUTES.plans.inGroups).json()) as ApiResponse<
    Record<
      string,
      [
        {
          result: {
            name: string;
            data: z.infer<typeof WorkoutPlanItemResponseSchema>[];
          };
        },
      ]
    >
  >;
};

export const createWorkoutPlan = async (
  data: z.infer<typeof CreateWorkoutPlanBodySchema>
) => {
  return (await http
    .url(API_ROUTES.plans.base)
    .post(data)
    .json()) as ApiResponse<z.infer<typeof WorkoutPlanItemResponseSchema>>;
};

export const updateWorkoutPlan = async (
  data: z.infer<typeof UpdateWorkoutPlanBodySchema>
) => {
  return (await http
    .url(API_ROUTES.plans.detail(data.id))
    .put(data)
    .json()) as ApiResponse<z.infer<typeof WorkoutPlanItemResponseSchema>>;
};

export const getWorkoutPlansByMe = async () => {
  return (await http.get(API_ROUTES.plans.byMe).json()) as ApiResponse<
    z.infer<typeof WorkoutPlanItemResponseSchema>[]
  >;
};

export const getWorkoutPlansByUserId = async (userId: string) => {
  return (await http
    .get(API_ROUTES.plans.byUserId(userId))
    .json()) as ApiResponse<z.infer<typeof WorkoutPlanItemResponseSchema>[]>;
};

export const getWorkoutPlanStats = async (id: string) => {
  return (await http.get(API_ROUTES.plans.stats(id)).json()) as ApiResponse<
    z.infer<typeof WorkoutPlanStatsResponseSchema>
  >;
};
