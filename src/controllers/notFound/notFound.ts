import { RequestHandler } from 'express';

export const notFound: RequestHandler = (_, res, next) => {
  res.status(404);
  next(new Error(res.getErrorText('notFound')));
};
