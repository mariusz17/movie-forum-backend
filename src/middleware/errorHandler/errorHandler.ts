import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _, res, _2) => {
  console.error('Error caught in error middleware:', err);

  res.sendApiResponse<string>({
    ok: false,
    status: 500,
    data: res.getErrorText('internal'),
  });
};
