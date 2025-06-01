export const WORKOUT_SESSION_KEYS = {
  base: ["workoutSession"],
  history: () => [...WORKOUT_SESSION_KEYS.base, "history"],
} as const;
