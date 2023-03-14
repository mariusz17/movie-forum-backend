export type UserRegisterRequestBody = {
  username: string;
  email: string;
  password: string;
};

export type UserLoginRequestBody = {
  email: string;
  password: string;
};

export type UserResponseData = {
  id: string;
  username: string;
  email: string;
};
