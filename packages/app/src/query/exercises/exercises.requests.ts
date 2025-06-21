import { z } from "zod";
import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { Exercise } from "../../prisma-generated";
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta";
import { ExerciseQuery } from "./exercises.types";
import { ExerciseItemSchema } from "app-config";

export const getExercises = async (query: ExerciseQuery) => {
  // return request(API_ROUTES.exercises.query(query), {
  //   method: "GET",
  // });

  return (await http
    .get(API_ROUTES.exercises.query(query))
    .json()) as ApiReponseWithMeta<z.infer<typeof ExerciseItemSchema>[]>;
};

export const getExercise = async (id: string) => {
  return (await http
    .get(API_ROUTES.exercises.detail(id))
    .json()) as ApiResponse<z.infer<typeof ExerciseItemSchema>>;
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
