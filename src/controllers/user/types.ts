import { IUser } from '../../services/mongoDB/models/user/types';

export type UserRegisterRequestBody = IUser;

export type UserLoginRequestBody = {
  email: string;
  password: string;
};

export type UserResponseData = {
  id: string;
  name: string;
  email: string;
};
