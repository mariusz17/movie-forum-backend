import { ErrorRequestHandler } from 'express';
import { t } from '../../services/i18n';

import { ApiResponseBody } from '../../types';

export const errorHandler: ErrorRequestHandler<
  void,
  ApiResponseBody<undefined>
> = (err, req, res, _) => {
  console.error('Error caught in error middleware:', err);

  const errorMessage = err.message
    ? err.message
    : t('internal', req.acceptsLanguages()[0]);
  const status = res.statusCode ? res.statusCode : 500;

  res.json({
    ok: false,
    status,
    errorMessage,
  });
};
