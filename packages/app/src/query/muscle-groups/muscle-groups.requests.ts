import { API_ROUTES } from "../../configs/api-routes";
import { request } from "../../libs/request";
import { MuscleGroup } from "../../prisma-generated";
import { ApiResponse } from "../../types/meta";

export const getMuscleGroups = () => {
  return request<ApiResponse<MuscleGroup[]>>(API_ROUTES.muscleGroups.query(), {
    method: "GET",
  });
};
