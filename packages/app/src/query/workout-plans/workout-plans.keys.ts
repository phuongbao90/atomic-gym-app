import { WorkoutPlanQuery } from "./workout-plans.types"

export const workoutPlanKeys = {
  all: ["workout-plans"],
  lists: () => [...workoutPlanKeys.all, "list"],
  list: (query: WorkoutPlanQuery) => [...workoutPlanKeys.lists(), query],
  detail: (id: number) => [...workoutPlanKeys.all, "detail", id],
  inGroups: () => [...workoutPlanKeys.lists(), "in-groups"],
}
