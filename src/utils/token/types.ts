import { Response } from 'express';

export type JwtAccessTokenPayload = {
  id: string;
  token: string;
};

export type JwtRefreshTokenPayload = {
  id: string;
  token: string;
};

export type JwtTokens = {
  jwtAccessToken: string;
  jwtRefreshToken: string;
};
