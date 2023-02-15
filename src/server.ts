import express, { NextFunction, Request, Response } from 'express';
import { env } from './config';
import { router as userRouter } from './routes/user';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './services/mongoDB/client';

connectDB(env.MONGO_URI);

const app = express();

app.use(express.json());

app.use('/api/user', userRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Sorry can't find that!" });
});

app.use(errorHandler);

app.listen(env.PORT, () =>
  console.log(`Server listening on port: ${env.PORT}`)
);
