import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../../services/mongoDB/models/user';
import { env } from '../../config';

import { JwtAccessTokenPayload } from '../../utils/token/types';
import { VerifiedUser } from './types';

declare global {
  namespace Express {
    interface Request {
      verifiedUser?: VerifiedUser;
    }
  }
}

export const protect: RequestHandler = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    // If token is expired, below function throws error 'jwt expired'
    const decodedAccessToken = verify(
      accessToken,
      env.JWT_ACCESS_TOKEN_SECRET
    ) as JwtAccessTokenPayload;

    const user = await User.findById(decodedAccessToken.id);

    if (
      user &&
      user.validAccessTokens.indexOf(decodedAccessToken.token) !== -1
    ) {
      req.verifiedUser = {
        publicId: user.publicId,
        privateId: user._id.toString(),
        username: user.username,
        email: user.email,
      };

      next();
      return;
    } else {
      res.status(401);
      throw new Error(res.getErrorText('unauthorized'));
    }
  } catch (error: any) {
    console.error(error);
    res.status(401);
    next(new Error(res.getErrorText('unauthorized')));
  }
};
