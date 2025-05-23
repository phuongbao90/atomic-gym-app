import { ExerciseQuery } from "../query/exercises/exercises.types";
import { WorkoutPlanQuery } from "../query/workout-plans/workout-plans.types";
import { WorkoutQuery } from "../query/workouts/workouts.types";
import { stringify } from "qs";

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    session: "/auth/session",
  },
  plans: {
    base: "/workout-plans",
    query: (query?: WorkoutPlanQuery) =>
      `${API_ROUTES.plans.base}${query ? `?${stringify(query)}` : ""}`,
    detail: (id: string) => `${API_ROUTES.plans.base}/${id}`,
    inGroups: "/workout-plans/in-groups",
    byMe: "/workout-plans/user/me",
    byUserId: (userId: string) => `/workout-plans/user/${userId}`,
  },

  workouts: {
    base: "/workouts",
    query: (query?: WorkoutQuery) =>
      `${API_ROUTES.workouts.base}${query ? `?${stringify(query)}` : ""}`,
    detail: (id: string) => `${API_ROUTES.workouts.base}/${id}`,
    byWorkoutPlanId: (planId: string) =>
      `${API_ROUTES.workouts.base}/plan/${planId}`,
  },

  exercises: {
    base: "/exercises",
    query: (query?: ExerciseQuery) => {
      return `${API_ROUTES.exercises.base}${query ? `?${stringify(query)}` : ""}`;
    },

    detail: (id: number) => `${API_ROUTES.exercises.base}/${id}`,
  },

  muscleGroups: {
    base: "/muscle-groups",
    query: () => `${API_ROUTES.muscleGroups.base}`,
    detail: (id: number) => `${API_ROUTES.muscleGroups.base}/${id}`,
  },
};
