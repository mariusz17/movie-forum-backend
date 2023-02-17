import dotenv from 'dotenv';

import { Env } from './types';

dotenv.config();

const envData = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Number(
    process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
  ),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Number(
    process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
  ),
  CORS_URL: process.env.CORS_URL,
};

for (const [key, value] of Object.entries(envData)) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Missing key ${key} in env file.`);
  }
}

export const env = envData as Env;
