import { API_ROUTES } from "../../configs/api-routes"
import { request } from "../../libs/request"
import { Exercise } from "../../prisma-generated"
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta"
import { ExerciseQuery } from "./exercises.types"

export const getExercises = (query: ExerciseQuery) => {
  return request<ApiReponseWithMeta<Exercise[]>>(
    API_ROUTES.exercises.query(query),
    {
      method: "GET",
    }
  )
}

export const getExercise = (id: number) => {
  return request<ApiResponse<Exercise>>(API_ROUTES.exercises.detail(id), {
    method: "GET",
  })
}

export const createExercise = (exercise: Partial<Exercise>) => {
  return request<ApiResponse<Exercise>>(API_ROUTES.exercises.base, {
    method: "POST",
    body: JSON.stringify(exercise),
  })
}
