import { API_ROUTES } from "../../configs/api-routes";
import { request } from "../../libs/request";
import { WorkoutPlan } from "../../prisma-generated";
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta";
import {
  CreateWorkoutPlanSchema,
  UpdateWorkoutPlanSchema,
  WorkoutPlanInGroups,
  WorkoutPlanQuery,
} from "./workout-plans.types";
import { z } from "zod";

export const getWorkoutPlans = (query: WorkoutPlanQuery) => {
  return request<ApiReponseWithMeta<WorkoutPlan[]>>(
    API_ROUTES.plans.query(query),
    {
      method: "GET",
    }
  );
};

export const getWorkoutPlan = (id: string) => {
  return request<ApiResponse<WorkoutPlan & { _count: { exercises: number } }>>(
    API_ROUTES.plans.detail(id),
    {
      method: "GET",
    }
  );
};

export const getWorkoutPlansInGroups = () => {
  return request<ApiResponse<WorkoutPlanInGroups>>(API_ROUTES.plans.inGroups, {
    method: "GET",
  });
};

export const createWorkoutPlan = (
  data: z.infer<typeof CreateWorkoutPlanSchema>
) => {
  return request<ApiResponse<WorkoutPlan>>(API_ROUTES.plans.base, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateWorkoutPlan = (
  data: z.infer<typeof UpdateWorkoutPlanSchema>
) => {
  return request<ApiResponse<WorkoutPlan>>(API_ROUTES.plans.detail(data.id), {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getWorkoutPlansByMe = () => {
  return request<ApiResponse<WorkoutPlan[]>>(API_ROUTES.plans.byMe, {
    method: "GET",
  });
};

export const getWorkoutPlansByUserId = (userId: string) => {
  return request<ApiResponse<WorkoutPlan[]>>(
    API_ROUTES.plans.byUserId(userId),
    {
      method: "GET",
    }
  );
};
