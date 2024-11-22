import * as Joi from 'joi';

export const jwtValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
});
