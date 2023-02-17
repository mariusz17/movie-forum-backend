export interface IUser {
  publicId: string;
  name: string;
  email: string;
  password: string;
  isLoggedOut: boolean;
  validRefreshTokens: string[];
}
