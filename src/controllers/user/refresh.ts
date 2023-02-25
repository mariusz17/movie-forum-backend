import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { env } from '../../config';
import { User } from '../../services/mongoDB/models/user';
import {
  createJwtAccessToken,
  createJwtRefreshToken,
  setTokenCookies,
} from '../../utils/token';

import { JwtRefreshTokenPayload } from '../../utils/token/types';

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    const decodedRefreshToken = verify(
      refreshToken,
      env.JWT_REFRESH_TOKEN_SECRET
    ) as JwtRefreshTokenPayload;

    const user = await User.findById(decodedRefreshToken.id);

    // If refresh token is not a valid token
    // (for example is being reused)
    if (
      user &&
      user.validRefreshTokens.indexOf(decodedRefreshToken.token) === -1
    ) {
      user.validAccessTokens = [];
      user.validRefreshTokens = [];
      await user.save();

      res.status(401);
      throw new Error(res.getErrorText('unauthorized'));
    }

    // If everything is OK
    if (
      user &&
      user.validRefreshTokens.indexOf(decodedRefreshToken.token) !== -1
    ) {
      const { jwtAccessToken, accessToken } = await createJwtAccessToken(
        user._id.toString(),
        user.validAccessTokens
      );

      const { jwtRefreshToken, refreshToken } = await createJwtRefreshToken(
        user._id.toString(),
        user.validRefreshTokens
      );

      // Delete current refresh token from user valid refresh tokens array
      user.validRefreshTokens = user.validRefreshTokens.filter(
        (token) => token !== decodedRefreshToken.token
      );
      // Add new refresh & access tokens to valid user tokens
      user.validRefreshTokens.push(refreshToken);
      user.validAccessTokens.push(accessToken);
      await user.save();

      setTokenCookies(res, { jwtAccessToken, jwtRefreshToken });
      res.sendApiResponse<undefined>({
        ok: true,
        status: 204,
      });
    }
  } catch (error: any) {
    console.error(error);
    res.status(401);
    next(new Error(res.getErrorText('unauthorized')));
  }
};
