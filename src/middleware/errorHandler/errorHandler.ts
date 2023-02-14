import { ErrorRequestHandler } from 'express';
import { sendResponse } from '../../services/sendResponse';

export const errorHandler: ErrorRequestHandler = (err, _, res) => {
  console.error('Error caught in error middleware:', err);

  sendResponse(res, false, 500, 'Internal server error');
};
