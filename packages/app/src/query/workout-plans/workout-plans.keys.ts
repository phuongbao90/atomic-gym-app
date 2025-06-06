import { WorkoutPlanQuery } from "./workout-plans.types";

export const workoutPlanKeys = {
  all: ["workout-plans"],
  lists: () => [...workoutPlanKeys.all, "list"],
  list: (query: WorkoutPlanQuery) => [...workoutPlanKeys.lists(), query],
  detail: (id: string) => [...workoutPlanKeys.all, "detail", id],
  inGroups: () => [...workoutPlanKeys.lists(), "in-groups"],
  listByUserId: (userId: string) => [
    ...workoutPlanKeys.lists(),
    "by-user",
    userId,
  ],
  listByMe: () => [...workoutPlanKeys.lists(), "by-me"],
  stats: (id: string) => [...workoutPlanKeys.all, "stats", id],
};
