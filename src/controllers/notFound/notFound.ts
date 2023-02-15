import { RequestHandler } from 'express';
import { ApiResponseBody } from '../../types';
import { t } from '../../middleware/i18n';

export const notFound: RequestHandler<{}, ApiResponseBody<undefined>> = (
  req,
  res
) => {
  res.status(404).json({
    ok: false,
    status: 404,
    errorMessage: t('notFound', req.acceptsLanguages()[0]),
  });
};
