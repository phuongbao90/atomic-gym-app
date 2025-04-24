import { WorkoutQuery } from "./workouts.types";

export const workoutKeys = {
  all: ["workouts"],
  lists: () => [...workoutKeys.all, "list"],
  list: (query: WorkoutQuery) => [...workoutKeys.lists(), query],
  detail: (id: string) => [...workoutKeys.all, "detail", id],
  listByWorkoutPlanId: (planId: string) => [...workoutKeys.lists(), planId],
};
