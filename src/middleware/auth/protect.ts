import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../../services/mongoDB/models/user';
import { env } from '../../config';
import { createNewTokens } from './createNewTokens';
import { setTokenCookies } from '../../utils/token/setTokenCookies';

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
        name: user.name,
        email: user.email,
      };

      next();
      return;
    } else {
      res.status(401);
      throw new Error(res.getErrorText('unauthorized'));
    }
  } catch (error: any) {
    // Handle expired or missing access token
    if (
      error.message === 'jwt expired' ||
      error.message === 'jwt must be provided'
    ) {
      try {
        const { refreshToken } = req.cookies;

        const { user, jwtAccessToken, jwtRefreshToken } = await createNewTokens(
          refreshToken,
          res
        );

        req.verifiedUser = {
          publicId: user.publicId,
          privateId: user._id.toString(),
          name: user.name,
          email: user.email,
        };

        setTokenCookies(res, { jwtAccessToken, jwtRefreshToken });

        next();
        return;
      } catch (error: any) {
        // If refresh token also expired or is missing:
        if (error.message === 'jwt expired') {
          res.status(401);
          next(new Error(res.getErrorText('sessionExpired')));
        } else if (error.message === 'jwt must be provided') {
          res.status(401);
          next(new Error(res.getErrorText('unauthorized')));
        } else {
          res.status(401);
          next(error);
        }
      }
    } else {
      res.status(401);
      next(error);
    }
  }
};
