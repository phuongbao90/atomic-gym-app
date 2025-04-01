import { WorkoutPlan } from "../../prisma-generated"
import { CommonQueryParams } from "../../types/meta"

export type WorkoutPlanQuery = CommonQueryParams & {
  isPublic?: boolean
  isPremium?: boolean
  isFeatured?: boolean
  isSingle?: boolean
  category?: string
}

export type WorkoutPlanInGroups = {
  isFeatured: (WorkoutPlan & { _count: { workouts: number } })[]
  byCategory: {
    result: {
      name: WorkoutPlan["category"]
      data: (WorkoutPlan & { _count: { workouts: number } })[]
    }
  }[]
  single: WorkoutPlan[]
}
