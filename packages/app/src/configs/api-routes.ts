import { ExerciseQuery } from "../query/exercises/exercises.types";
import { BodyLogPeriodType } from "../query/logs/logs.types";
import { WorkoutPlanQuery } from "../query/workout-plans/workout-plans.types";
import { WorkoutQuery } from "../query/workout-template/workout-template.types";
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
    stats: (id: string) => `/workout-plans/stats/${id}`,
  },

  workoutTemplates: {
    base: "/workout-templates",
    query: (query?: WorkoutQuery) =>
      `${API_ROUTES.workoutTemplates.base}${query ? `?${stringify(query)}` : ""}`,
    detail: (id: string) => `${API_ROUTES.workoutTemplates.base}/${id}`,
    byWorkoutPlanId: (planId: string) =>
      `${API_ROUTES.workoutTemplates.base}/plan/${planId}`,
  },

  exercises: {
    base: "/exercises",
    query: (query?: ExerciseQuery) => {
      return `${API_ROUTES.exercises.base}${query ? `?${stringify(query)}` : ""}`;
    },

    detail: (id: string) => `${API_ROUTES.exercises.base}/${id}`,
  },

  muscleGroups: {
    base: "/muscle-groups",
    query: () => `${API_ROUTES.muscleGroups.base}`,
    detail: (id: number) => `${API_ROUTES.muscleGroups.base}/${id}`,
  },

  logs: {
    base: "/logs",
    workouts: (periodType: string, periodValue: string) =>
      `${API_ROUTES.logs.base}/workouts?periodType=${periodType}&periodValue=${periodValue}`,
    body: (periodType: BodyLogPeriodType) =>
      `${API_ROUTES.logs.base}/body?periodType=${periodType}`,
    createBodyLogs: () => `${API_ROUTES.logs.base}/body`,
    bodyMeasurementTypes: () =>
      `${API_ROUTES.logs.base}/body-measurement-types`,
    deleteBodyLog: (id: string) => `${API_ROUTES.logs.base}/body?id=${id}`,
  },

  workoutSession: {
    base: "/workout-session",
    history: () => `${API_ROUTES.workoutSession.base}/history`,
    detail: (id: string) => `${API_ROUTES.workoutSession.base}/detail?id=${id}`,
    delete: (id: string) => `${API_ROUTES.workoutSession.base}/${id}`,
    deleteExercise: (id: string, exerciseId: string) =>
      `${API_ROUTES.workoutSession.base}/${id}/exercise/${exerciseId}`,
    updateExerciseSets: (id: string, exerciseId: string) =>
      `${API_ROUTES.workoutSession.base}/${id}/exercise/${exerciseId}/sets`,
    update: (id: string) => `${API_ROUTES.workoutSession.base}/${id}`,
    create: () => `${API_ROUTES.workoutSession.base}`,
    plan: (id: string) => `${API_ROUTES.workoutSession.base}/plan/${id}`,
    muscleGroupStats: (periodType: string, periodValue: string) =>
      `${API_ROUTES.workoutSession.base}/muscle-group-stats?periodType=${periodType}&periodValue=${periodValue}`,
  },
};
