import { RequestHandler } from 'express';

export const notFound: RequestHandler = (_, res) => {
  res.sendApiResponse(false, 404, null, res.getErrorText('notFound'));
};
