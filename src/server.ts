import express from 'express';
import { errorHandler } from './middleware/errorHandler';

import { env } from './config';
import { connectDB } from './services/mongoDB/client';

import { t } from './services/i18n';

const app = express();

connectDB(env.MONGO_URI);

app.get('/api', (req, res) => {
  res.json({
    message: t('greeting', req.acceptsLanguages()[0]),
  });
});

app.use(errorHandler);

app.use((_, res) => {
  res.status(404).json({ message: "Sorry can't find that!" });
});

app.listen(env.PORT, () =>
  console.log(`Server listening on port: ${env.PORT}`)
);
