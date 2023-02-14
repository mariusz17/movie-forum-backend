import { Response } from 'express';
import { ApiResponse } from './types';

export const sendResponse = <T>(
  res: Response,
  ok: boolean,
  status: number,
  errorMessage?: string,
  data?: T
) => {
  res.json({
    ok,
    status,
    errorMessage,
    data,
  } satisfies ApiResponse<T>);
};
