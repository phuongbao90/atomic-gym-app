import { ExerciseQuery } from "../query/exercises/exercises.types"
import { WorkoutPlanQuery } from "../query/workout-plans/workout-plans.types"
import { WorkoutQuery } from "../query/workouts/workouts.types"
import { stringify } from "qs"

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    session: "/auth/session",
  },
  user: {
    me: "/user/me",
    id: (id: number) => `/user/${id}`,
  },
  getUser: (id: number) => `/user/${id}`,

  plans: {
    base: "/workout-plans",
    query: (query?: WorkoutPlanQuery) =>
      `${API_ROUTES.plans.base}${query ? `?${stringify(query)}` : ""}`,
    detail: (id: number) => `${API_ROUTES.plans.base}/${id}`,
    inGroups: "/workout-plans/in-groups",
  },

  workouts: {
    base: "/workouts",
    query: (query?: WorkoutQuery) =>
      `${API_ROUTES.workouts.base}${query ? `?${stringify(query)}` : ""}`,
    detail: (id: number) => `${API_ROUTES.workouts.base}/${id}`,
    byWorkoutPlanId: (planId: number) =>
      `${API_ROUTES.workouts.base}/plan/${planId}`,
  },

  exercises: {
    base: "/exercises",
    query: (query?: ExerciseQuery) =>
      `${API_ROUTES.exercises.base}${query ? `?${stringify(query)}` : ""}`,
    detail: (id: number) => `${API_ROUTES.exercises.base}/${id}`,
  },
}
