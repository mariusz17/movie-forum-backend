import express from 'express';
import { config } from './config';

const app = express();

app.listen(config.env.PORT, () =>
  console.log(`Server listening on port: ${config.env.PORT}`)
);
