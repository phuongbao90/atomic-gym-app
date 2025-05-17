import { registerAs } from "@nestjs/config";

export default registerAs("env", () => ({
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: process.env.APP_PORT,
  SWAGGER_PORT: process.env.SWAGGER_PORT,
  BASE_URL: process.env.BASE_URL,
  WEB_URL: process.env.WEB_URL,
  API_VERSION: process.env.API_VERSION,
}));
