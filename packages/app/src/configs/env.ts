const _ENV =
  (process.env.EXPO_PUBLIC_NODE_ENV as "development" | "test" | "production") ||
  process.env.NODE_ENV;

// const url = "192.168.31.64"; // home
// const url = "192.168.110.2"; // my-coffee
const url = "192.168.1.238"; // patio
// const url = "localhost";

const _API_URL = {
  // development: "http://192.168.110.36:3000",
  development: `http://${url}:3000`,
  test: `http://${url}:3000`,
  production: `http://${url}:3000`,
};

const API_URL = _API_URL[_ENV];

export const ENV = {
  API_URL,
  ENV: _ENV,
};
