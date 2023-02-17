import { sign } from 'jsonwebtoken';
import { env } from '../../config';
import { v4 as uuidv4 } from 'uuid';

import { JwtAccessTokenPayload } from './types';

export const createJwtAccessToken = async (
  id: string,
  currentValidTokens: string[]
) => {
  let accessToken;

  do {
    accessToken = uuidv4();
  } while (currentValidTokens.indexOf(accessToken) !== -1);

  const jwtPayload: JwtAccessTokenPayload = {
    id,
    token: accessToken,
  };

  const jwtAccessToken = sign(jwtPayload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });

  return { accessToken, jwtAccessToken };
};
