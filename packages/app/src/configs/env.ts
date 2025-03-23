const _ENV = process.env.ENV as "development" | "testing" | "production";

const _API_URL = {
  // development: "http://192.168.110.112:3000",
  development: "http://192.168.31.26:3000",
  testing: "http://192.168.31.26:3000",
  production: "http://192.168.31.26:3000",
};

const API_URL = _API_URL[_ENV];

export const ENV = {
  API_URL,
  ENV: _ENV,
};
