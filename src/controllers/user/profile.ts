import { RequestHandler } from 'express';

import { UserResponseData } from './types';

export const profile: RequestHandler = (req, res, next) => {
  try {
    if (req.verifiedUser) {
      res.sendApiResponse<UserResponseData>({
        ok: true,
        status: 200,
        data: {
          id: req.verifiedUser.publicId,
          username: req.verifiedUser.username,
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
