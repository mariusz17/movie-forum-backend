import { ErrorRequestHandler } from 'express';

import { ApiResponseBody } from '../../types';

export const errorHandler: ErrorRequestHandler<void, ApiResponseBody<null>> = (
  err,
  _,
  res,
  _2
) => {
  console.error('Error caught in error middleware:', err);

  const errorMessage = err.message ? err.message : res.getErrorText('internal');
  const status = res.statusCode ? res.statusCode : 500;

  res.json({
    ok: false,
    status,
    errorMessage,
  });
};
