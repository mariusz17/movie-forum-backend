import express from 'express';
import { env } from './config';
import { connectDB } from './services/mongoDB/client';

const app = express();

connectDB(env.MONGO_URI);

app.listen(env.PORT, () =>
  console.log(`Server listening on port: ${env.PORT}`)
);
