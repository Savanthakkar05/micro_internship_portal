// config/env.ts
import dotenv from "dotenv";
import Joi from "joi";
import { APIError } from "../utils/errorHandling";
import httpStatus from 'http-status';

dotenv.config(); // loads .env file

// Define schema for required env vars
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  PORT: Joi.number().default(5000),

  DATABASE_URL: Joi.string().uri().required(),

  SECRET_KEY: Joi.string().min(8).required(),

  STRIPE_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRATION_TIME_ACCESS_TOKEN_MINUTES: Joi.number().default(30),
  JWT_EXPIRATION_TIME_REFRESH_TOKEN_DAYS: Joi.number().default(30),
}).unknown(); // allow other vars not defined

// Validate
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new APIError(httpStatus.BAD_REQUEST, `Env validation error: ${error.message}`);
}

// Export validated variables
export const env = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  jwt: {
    secret: envVars.SECRET_KEY,
    accessExpirationMinutes: envVars.JWT_EXPIRATION_TIME_ACCESS_TOKEN_MINUTES,
    refreshExpirationDays: envVars.JWT_EXPIRATION_TIME_REFRESH_TOKEN_DAYS,
  },
  stripeKey: envVars.STRIPE_SECRET_KEY,
};
