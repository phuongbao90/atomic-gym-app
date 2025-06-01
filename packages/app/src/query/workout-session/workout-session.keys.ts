export const WORKOUT_SESSION_KEYS = {
  base: ["workoutSession"],
  history: () => [...WORKOUT_SESSION_KEYS.base, "history"],
  detail: (id: string) => [...WORKOUT_SESSION_KEYS.base, "detail", id],
} as const;
