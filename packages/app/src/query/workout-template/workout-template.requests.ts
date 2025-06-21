import { WorkoutTemplateItemSchema } from "app-config";
import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta";
import { WorkoutQuery } from "./workout-template.types";
import { z } from "zod";

export const getWorkoutTemplates = async (
  query: WorkoutQuery & { page: number }
) => {
  return (await http
    .get(API_ROUTES.workoutTemplates.query(query))
    .json()) as ApiReponseWithMeta<z.infer<typeof WorkoutTemplateItemSchema>[]>;
};

export const getWorkoutTemplate = async (id: string) => {
  return (await http
    .get(API_ROUTES.workoutTemplates.detail(id))
    .json()) as ApiResponse<z.infer<typeof WorkoutTemplateItemSchema>>;
};

export const getWorkoutTemplatesByWorkoutPlanId = async (planId: string) => {
  return (await http
    .get(API_ROUTES.workoutTemplates.byWorkoutPlanId(planId))
    .json()) as ApiReponseWithMeta<z.infer<typeof WorkoutTemplateItemSchema>[]>;
};
