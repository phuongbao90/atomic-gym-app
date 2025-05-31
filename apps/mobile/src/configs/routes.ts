import QueryString from "qs";

export type ExercisesScreenParams =
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

export type InProgressWorkoutExercisesScreenParams = {
  workoutId: string;
  page: string;
};

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

  // tabs: {
  //   home: () => "/(tabs)" as const,
  //   plans: () => "/plans" as const,
  //   coach: () => "/coach" as const,
  //   history: () => "/history" as const,
  //   statistics: () => "/statistics" as const,
  // },

  // exercises: "/exercises",
  // createExercise: "/exercises/create",
  // exercise: (id: string) => `/exercises/${id}`,
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

  inProgress: {
    base: "/in-progress" as const,
    workout: (id: string) =>
      `${appRoutes.inProgress.base}/workout?workoutId=${id}` as const,
    workoutExercises: (params: InProgressWorkoutExercisesScreenParams) =>
      `${appRoutes.inProgress.base}/workout-exercises?${QueryString.stringify(
        params
      )}` as const,
  },

  settings: "/settings",
  profile: "/profile",

  logs: {
    base: "/logs" as const,
    bodyLogHistory: (type: string) =>
      `${appRoutes.logs.base}/body-log-history?type=${type}` as const,
  } as const,
} as const;
