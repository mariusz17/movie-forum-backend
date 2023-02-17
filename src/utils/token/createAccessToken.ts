import { sign } from 'jsonwebtoken';
import { env } from '../../config';

import { JwtAccessTokenPayload } from './types';

export const createJwtAccessToken = async (id: string) => {
  const jwtPayload: JwtAccessTokenPayload = {
    id,
  };

  return sign(jwtPayload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });
};
