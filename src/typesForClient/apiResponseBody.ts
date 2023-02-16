import { ApiResponseBody } from '../middleware/apiResponse/types';
import { UserResponseData } from '../controllers/user/types';

export type UserRegisterResponseBody = ApiResponseBody<UserResponseData>;
export type UserLoginResponseBody = ApiResponseBody<UserResponseData>;
export type ErrorResponseBody = ApiResponseBody<undefined>;
