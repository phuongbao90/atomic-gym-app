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

  exercises: "/(app)/exercises",
  createExercise: "/(app)/exercises/create",
  exercise: (id: string) => `/(app)/exercises/${id}`,

  settings: "/(app)/settings",
  profile: "/(app)/profile",
} as const;
