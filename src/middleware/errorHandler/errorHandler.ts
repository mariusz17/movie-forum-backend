import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _, res, _2) => {
  console.error('Error caught in error middleware:', err);

  res.sendApiResponse({
    ok: false,
    status: res.statusCode ? res.statusCode : 500,
    errorMessage: err.message.toString()
      ? err.message.toString()
      : res.getErrorText('internal'),
  });
};
