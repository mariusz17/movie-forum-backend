import { IUser } from '../../services/mongoDB/models/user/types';

export type NewUserRequestBody = IUser;

export type UserResponseData = {
  id: string;
  name: string;
  email: string;
  token: string;
};
