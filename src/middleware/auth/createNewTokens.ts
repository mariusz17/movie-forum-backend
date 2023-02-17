import { verify } from 'jsonwebtoken';
import { env } from '../../config';
import { User } from '../../services/mongoDB/models/user';

import { Response } from 'express';
import { JwtRefreshTokenPayload } from '../../utils/token/types';
import { createJwtAccessToken, createJwtRefreshToken } from '../../utils/token';

export const createNewTokens = async (refreshToken: string, res: Response) => {
  // If refresh token is also expired,
  // below function will throw error 'jwt expired'
  const decodedRefreshToken = verify(
    refreshToken,
    env.JWT_REFRESH_TOKEN_SECRET
  ) as JwtRefreshTokenPayload;

  const user = await User.findById(decodedRefreshToken.id);

  // If refresh token is not a valid refresh token
  // (for example is being reused):
  if (
    user &&
    user.validRefreshTokens.indexOf(decodedRefreshToken.token) === -1
  ) {
    user.validAccessTokens = [];
    user.validRefreshTokens = [];
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

    return { user, jwtAccessToken, jwtRefreshToken };
  } else {
    res.status(401);
    throw new Error(res.getErrorText('unauthorized'));
  }
};
