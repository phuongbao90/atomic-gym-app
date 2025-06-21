import QueryString from "qs";

type ExercisesScreenParams =
  | {
      mode: "default";
    }
  | {
      allowSelect: "true";
      replaceWorkoutExerciseId: string;
      mode: "replaceToActiveWorkoutSession";
    }
  | {
      allowSelect: "true";
      mode: "addToActiveWorkoutSession";
    }
  | ({ allowSelect: "true"; workoutId: string } & (
      | {
          replaceWorkoutExerciseId: string;
          mode: "replaceToCreateWorkoutPlan";
        }
      | { mode: "addToCreateWorkoutPlan" }
    ));

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

  exercises: {
    base: "/exercises" as const,
    list: (params: ExercisesScreenParams) =>
      `${appRoutes.exercises.base}?${QueryString.stringify(params)}` as const,
    detail: (id: string) => `${appRoutes.exercises.base}/${id}` as const,
    create: () => `${appRoutes.exercises.base}/create` as const,
  } as const,

  workoutPlans: {
    base: "/workout-plans" as const,
    create: (params: { workoutPlanId?: string }) =>
      `${appRoutes.workoutPlans.base}/create?${QueryString.stringify(params)}` as const,
    edit: (id: string) => `${appRoutes.workoutPlans.base}/${id}/edit` as const,
    detail: (id: string) => `${appRoutes.workoutPlans.base}/${id}` as const,
    editWorkoutOrder: () =>
      `${appRoutes.workoutPlans.base}/edit-workout-order` as const,
    editExerciseSets: (params: {
      workoutId: string;
      workoutExerciseId: string;
    }) =>
      `${appRoutes.workoutPlans.base}/edit-exercise-sets?${QueryString.stringify(
        params
      )}` as const,

    editSet: (params: {
      workoutId: string;
      workoutExerciseId: string;
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

  workoutSession: {
    base: "/workout-session" as const,
    detail: (id: string) =>
      `${appRoutes.workoutSession.base}/detail?id=${id}` as const,
    edit: (id: string) =>
      `${appRoutes.workoutSession.base}/edit-session?id=${id}` as const,
    editExercise: (sessionId: string, exerciseId: string, pageIndex: string) =>
      `${appRoutes.workoutSession.base}/edit-session-exercise?sessionId=${sessionId}&exerciseId=${exerciseId}&pageIndex=${pageIndex}` as const,
    editSessionDate: (id: string) =>
      `${appRoutes.workoutSession.base}/edit-session-date?id=${id}` as const,
  } as const,

  inProgress: {
    base: "/in-progress" as const,
    workout: (id: string) =>
      `${appRoutes.inProgress.base}/workout?workoutId=${id}` as const,
    workoutExercises: (pageIndex: string) =>
      `${appRoutes.inProgress.base}/workout-exercises?pageIndex=${pageIndex}` as const,
  },

  settings: "/settings",
  profile: "/profile",

  logs: {
    base: "/logs" as const,
    bodyLogHistory: (type: string) =>
      `${appRoutes.logs.base}/body-log-history?type=${type}` as const,
  } as const,
} as const;
