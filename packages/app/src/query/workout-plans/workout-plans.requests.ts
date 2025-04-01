import { API_ROUTES } from "../../configs/api-routes"
import { request } from "../../libs/request"
import { WorkoutPlan } from "../../prisma-generated"
import { ApiReponseWithMeta, ApiResponse } from "../../types/meta"
import { WorkoutPlanInGroups, WorkoutPlanQuery } from "./workout-plans.types"

export const getWorkoutPlans = (query: WorkoutPlanQuery) => {
  return request<ApiReponseWithMeta<WorkoutPlan[]>>(
    API_ROUTES.plans.query(query),
    {
      method: "GET",
    }
  )
}

export const getWorkoutPlan = (id: number) => {
  return request<ApiResponse<WorkoutPlan & { _count: { exercises: number } }>>(
    API_ROUTES.plans.detail(id),
    {
      method: "GET",
    }
  )
}

export const getWorkoutPlansInGroups = () => {
  return request<ApiResponse<WorkoutPlanInGroups>>(API_ROUTES.plans.inGroups, {
    method: "GET",
  })
}
