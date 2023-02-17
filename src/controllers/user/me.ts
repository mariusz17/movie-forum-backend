import { RequestHandler } from 'express';

import { UserResponseData } from './types';

export const me: RequestHandler = (req, res, next) => {
  try {
    if (req.verifiedUser) {
      res.sendApiResponse<UserResponseData>({
        ok: true,
        status: 200,
        data: {
          publicId: req.verifiedUser.publicId,
          name: req.verifiedUser.name,
          email: req.verifiedUser.email,
        },
      });
    } else {
      res.status(500);
      throw new Error(res.getErrorText('internal'));
    }
  } catch (error) {
    next(error);
  }
};
