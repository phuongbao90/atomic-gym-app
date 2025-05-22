import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { MuscleGroup } from "../../prisma-generated";
import { ApiResponse } from "../../types/meta";

export const getMuscleGroups = async () => {
  // return request<ApiResponse<MuscleGroup[]>>(API_ROUTES.muscleGroups.query(), {
  //   method: "GET",
  // });

  return (await http
    .get(API_ROUTES.muscleGroups.query())
    .json()) as ApiResponse<MuscleGroup[]>;
};
