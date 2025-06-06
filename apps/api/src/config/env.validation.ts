import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  SWAGGER_PORT: Joi.number().required(),
  BASE_URL: Joi.string().required(),
  WEB_URL: Joi.string().required(),
  API_VERSION: Joi.string().required(),

  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),

  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),

  // SMTP_PASS: Joi.string().optional(),
  // SMTP_FROM: Joi.string().optional(),
});
