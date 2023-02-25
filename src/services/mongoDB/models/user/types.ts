export interface IUser {
  publicId: string;
  name: string;
  email: string;
  password: string;
  validRefreshTokens: string[];
  validAccessTokens: string[];
}
