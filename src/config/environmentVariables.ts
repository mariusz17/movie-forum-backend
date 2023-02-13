import dotenv from 'dotenv';

dotenv.config();

const envData = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_URL: process.env.CORS_URL,
};

interface Config {
  NODE_ENV: string;
  PORT: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  CORS_URL: string;
}

for (const [key, value] of Object.entries(envData)) {
  if (typeof value !== 'string') {
    throw new Error(`Missing key ${key} in env file.`);
  }
}

export const env = envData as Config;
