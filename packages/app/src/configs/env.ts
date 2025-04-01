const _ENV = process.env.EXPO_PUBLIC_NODE_ENV as
  | "development"
  | "testing"
  | "production"

const url = "192.168.31.63"

const _API_URL = {
  // development: "http://192.168.110.112:3000",
  development: `http://${url}:3000`,
  testing: `http://${url}:3000`,
  production: `http://${url}:3000`,
}

const API_URL = _API_URL[_ENV]

export const ENV = {
  API_URL,
  ENV: _ENV,
}
