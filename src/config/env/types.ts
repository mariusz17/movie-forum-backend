export type Env = {
  NODE_ENV: string;
  PORT: string;
  MONGO_URI: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: number;
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: number;
  CORS_URL: string;
};
