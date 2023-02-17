export type JwtAccessTokenPayload = {
  id: string;
};

export type JwtRefreshTokenPayload = {
  id: string;
  token: string;
};
