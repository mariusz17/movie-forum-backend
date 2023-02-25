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
  publicId: string;
  name: string;
  email: string;
};
