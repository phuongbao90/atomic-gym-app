export const Env = {
  NODE_ENV: process.env.EXPO_PUBLIC_NODE_ENV,
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  TEST_MODE: process.env.NODE_ENV === "test",
};
