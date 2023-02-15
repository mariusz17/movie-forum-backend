import express from 'express';
import { env } from './config';
import { i18n } from './middleware/i18n';
import { router as userRouter } from './routes/user';
import { notFound } from './controllers/notFound/notFound';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './services/mongoDB/client';

connectDB(env.MONGO_URI);

const app = express();

app.use(express.json());
app.use(i18n);

app.use('/api/user', userRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(env.PORT, () =>
  console.log(`Server listening on port: ${env.PORT}`)
);
