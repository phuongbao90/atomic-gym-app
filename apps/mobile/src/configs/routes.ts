import QueryString from "qs";

export const appRoutes = {
  login: "/(auth)",
  register: "/(auth)/register",
  forgotPassword: "/(auth)/forgot-password",
  otpVerify: "/(auth)/otp-verify",

  // tabs
  home: "/(tabs)",
  plans: "/plans",
  coach: "/coach",
  history: "/history",
  statistics: "/statistics",

  // exercises: "/exercises",
  // createExercise: "/exercises/create",
  // exercise: (id: string) => `/exercises/${id}`,
  exercises: {
    base: "/exercises" as const,
    list: ({
      allowSelect = false,
      activeWorkoutIndex = 0,
      replaceExerciseId,
    }: {
      allowSelect?: boolean;
      activeWorkoutIndex?: number;
      replaceExerciseId?: number;
    }) =>
      `${appRoutes.exercises.base}?${QueryString.stringify({
        allowSelect,
        activeWorkoutIndex,
        replaceExerciseId,
      })}` as const,
    detail: (id: string) => `${appRoutes.exercises.base}/${id}` as const,
    create: () => `${appRoutes.exercises.base}/create` as const,
  } as const,

  workoutPlans: {
    base: "/workout-plans" as const,
    create: () => `${appRoutes.workoutPlans.base}/create` as const,
    edit: (id: string) => `${appRoutes.workoutPlans.base}/${id}/edit` as const,
    detail: (id: string) => `${appRoutes.workoutPlans.base}/${id}` as const,
    exerciseDetail: (params: {
      workoutIndex: number;
      index: number;
    }) =>
      `${appRoutes.workoutPlans.base}/exercise-detail?${QueryString.stringify(
        params
      )}` as const,

    editSet: (params: {
      workoutIndex: number;
      exerciseIndex: number;
      setIndex: number;
    }) =>
      `${appRoutes.workoutPlans.base}/edit-set?${QueryString.stringify(
        params
      )}` as const,
  },

  workouts: {
    base: "/workouts" as const,
    detail: (id: string) => `${appRoutes.workouts.base}/${id}` as const,
  } as const,

  settings: "/settings",
  profile: "/profile",
} as const;
