export type UserRegisterRequestBody = {
  name: string;
  email: string;
  password: string;
};

export type UserLoginRequestBody = {
  email: string;
  password: string;
};

export type UserResponseData = {
  id: string;
  name: string;
  email: string;
};
