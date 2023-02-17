import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _, res, _2) => {
  console.error('Error caught in error middleware:', err);

  const status = res.statusCode ? res.statusCode : 500;
  const errorMessage = err.message ? err.message : res.getErrorText('internal');

  res.sendApiResponse({
    ok: false,
    status,
    errorMessage,
  });
};
