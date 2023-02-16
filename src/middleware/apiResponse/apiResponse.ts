import { RequestHandler, Response } from 'express';

import { SendApiResponse, ApiResponseBody } from './types';

declare global {
  namespace Express {
    interface Response {
      sendApiResponse: SendApiResponse;
    }
  }
}

const sendApiResponseTemplate =
  (res: Response): SendApiResponse =>
  <T>(data: ApiResponseBody<T>) => {
    res.status(data.status);
    res.json({
      ok: data.ok,
      status: data.status,
      data: data.data,
      errorMessage: data.errorMessage,
    });
  };

export const apiResponse: RequestHandler = (_, res, next) => {
  try {
    res = Object.assign(res, {
      sendApiResponse: sendApiResponseTemplate(res),
    });
    next();
  } catch (error) {
    next(error);
  }
};
