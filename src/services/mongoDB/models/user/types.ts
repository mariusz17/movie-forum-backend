export interface IUser {
  publicId: string;
  username: string;
  email: string;
  password: string;
  validRefreshTokens: string[];
  validAccessTokens: string[];
}
