import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../../services/mongoDB/models/user';
import { env } from '../../config';
import { createJwtAccessToken, createJwtRefreshToken } from '../../utils/token';

import {
  JwtAccessTokenPayload,
  JwtRefreshTokenPayload,
} from '../../utils/token/types';
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

    if (user && !user.isLoggedOut) {
      req.verifiedUser = {
        publicId: user.publicId,
        privateId: user._id.toString(),
        name: user.name,
        email: user.email,
      };

      next();
    } else {
      res.status(401);
      throw new Error(res.getErrorText('unauthorized'));
    }
  } catch (error: any) {
    // Handle expired access token
    if (error.message === 'jwt expired') {
      try {
        const { refreshToken } = req.cookies;

        // If token is expired, below function throws error 'jwt expired'
        const decodedRefreshToken = verify(
          refreshToken,
          env.JWT_REFRESH_TOKEN_SECRET
        ) as JwtRefreshTokenPayload;

        const user = await User.findById(decodedRefreshToken.id);

        // If refresh token is being reused:
        if (
          user &&
          user.validRefreshTokens.indexOf(decodedRefreshToken.token) === -1
        ) {
          user.isLoggedOut = true;
          await user.save();

          res.status(401);
          throw new Error(res.getErrorText('sessionExpired'));
        }

        // If everything is OK:
        if (
          user &&
          !user.isLoggedOut &&
          user.validRefreshTokens.indexOf(decodedRefreshToken.token) !== -1
        ) {
          const jwtAccessToken = await createJwtAccessToken(
            user._id.toString()
          );

          const { jwtRefreshToken, refreshToken } = await createJwtRefreshToken(
            user._id.toString(),
            user.validRefreshTokens
          );

          // Delete current refresh token from user valid refresh tokens array
          user.validRefreshTokens = user.validRefreshTokens.filter(
            (token) => token !== decodedRefreshToken.token
          );
          // Add new refresh token to valid user refresh tokens
          user.validRefreshTokens.push(refreshToken);
          await user.save();

          req.verifiedUser = {
            publicId: user.publicId,
            privateId: user._id.toString(),
            name: user.name,
            email: user.email,
          };

          res
            .cookie('accessToken', jwtAccessToken, {
              maxAge: 1000 * 60 * 60 * 24 * 30,
            })
            .cookie('refreshToken', jwtRefreshToken, {
              maxAge: 1000 * 60 * 60 * 24 * 30,
            });

          next();
          return;
        }
      } catch (error: any) {
        // If refresh token also expired:
        if (error.message === 'jwt expired') {
          res.status(401);
          next(new Error(res.getErrorText('sessionExpired')));
          return;
        }

        res.status(401);
        next(error);
        return;
      }
    }

    res.status(401);
    next(error);
  }
};
