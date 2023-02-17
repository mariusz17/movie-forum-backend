import { Response } from 'express';
import { env } from '../../config';
import { JwtTokens } from './types';

export const setTokenCookies = (
  res: Response,
  { jwtAccessToken, jwtRefreshToken }: JwtTokens
) => {
  const accessTokenCookieExpirationTime =
    env.JWT_ACCESS_TOKEN_EXPIRATION_TIME * 1000;
  const refreshTokenCookieExpirationTime =
    env.JWT_REFRESH_TOKEN_EXPIRATION_TIME * 1000;

  res
    .cookie('accessToken', jwtAccessToken, {
      maxAge: accessTokenCookieExpirationTime,
      httpOnly: true,
    })
    .cookie('refreshToken', jwtRefreshToken, {
      maxAge: refreshTokenCookieExpirationTime,
      httpOnly: true,
    });
};
