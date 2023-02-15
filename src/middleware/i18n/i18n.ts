import { RequestHandler } from 'express';
import { getErrorText } from './getErrorText';

import { ErrorMessagesKeys } from './errorMessages/types';

declare global {
  namespace Express {
    interface Response {
      getErrorText: (errorKey: ErrorMessagesKeys) => string;
    }
  }
}

export const i18n: RequestHandler = (req, res, next) => {
  try {
    res = Object.assign(res, {
      getErrorText: getErrorText(req.acceptsLanguages()[0]),
    });
    next();
  } catch (error) {
    next(error);
  }
};
