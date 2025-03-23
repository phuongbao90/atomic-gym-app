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

  exercise: "/exercise",
  getExercise: (id: number) => `/exercise/${id}`,
};
