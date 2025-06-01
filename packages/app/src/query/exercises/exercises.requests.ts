import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { Exercise } from "../../prisma-generated";
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta";
import { ExerciseQuery } from "./exercises.types";

export const getExercises = async (query: ExerciseQuery) => {
  // return request(API_ROUTES.exercises.query(query), {
  //   method: "GET",
  // });

  return (await http
    .get(API_ROUTES.exercises.query(query))
    .json()) as ApiReponseWithMeta<Exercise[]>;
};

export const getExercise = async (id: string) => {
  // return request<ApiResponse<Exercise>>(API_ROUTES.exercises.detail(id), {
  //   method: "GET",
  // });

  return (await http
    .get(API_ROUTES.exercises.detail(id))
    .json()) as ApiResponse<Exercise>;
};

export const createExercise = async (
  exercise: Partial<Exercise> & {
    name: string;
    description?: string;
    primaryMuscleIds: number[];
  }
) => {
  // return request<ApiResponse<Exercise>>(API_ROUTES.exercises.base, {
  //   method: "POST",
  //   body: JSON.stringify(exercise),
  // });

  return (await http
    .url(API_ROUTES.exercises.base)
    .post(exercise)
    .json()) as ApiResponse<Exercise>;
};
