export const WORKOUT_SESSION_KEYS = {
  base: ["workoutSession"],
  history: () => [...WORKOUT_SESSION_KEYS.base, "history"],
  detail: (id: string) => [...WORKOUT_SESSION_KEYS.base, "detail", id],
  plan: (id: string) => [...WORKOUT_SESSION_KEYS.base, "plan", id],
  muscleGroupStats: (periodType: string, periodValue: string) => [
    ...WORKOUT_SESSION_KEYS.base,
    "muscleGroupStats",
    periodType,
    periodValue,
  ],
} as const;
