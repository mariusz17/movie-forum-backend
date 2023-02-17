import { sign } from 'jsonwebtoken';
import { env } from '../../config';
import { v4 as uuidv4 } from 'uuid';

import { JwtRefreshTokenPayload } from './types';

export const createJwtRefreshToken = async (
  id: string,
  currentValidTokens: string[]
) => {
  let refreshToken;

  do {
    refreshToken = uuidv4();
  } while (currentValidTokens.indexOf(refreshToken) !== -1);

  const jwtPayload: JwtRefreshTokenPayload = {
    id,
    token: refreshToken,
  };

  const jwtRefreshToken = sign(jwtPayload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return { refreshToken, jwtRefreshToken };
};
