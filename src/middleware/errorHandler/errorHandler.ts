import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _, res, _2) => {
  console.error('Error caught in error middleware:', err);

  let status: number;
  let errorMessage: string;

  if (res.statusCode === 200) {
    status = 500;
    errorMessage = res.getErrorText('internal');
  } else {
    status = res.statusCode;
    errorMessage = err.message ? err.message : res.getErrorText('internal');
  }

  res.sendApiResponse({
    ok: false,
    status,
    errorMessage,
  });
};
