import { RequestHandler } from 'express';
import { compare } from 'bcryptjs';
import { User } from '../../services/mongoDB/models/user';
import { generateToken } from './token';

import { UserLoginRequestBody, UserResponseData } from './types';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as UserLoginRequestBody;

    if (!email || !password) {
      res.sendApiResponse({
        ok: false,
        status: 401,
        errorMessage: res.getErrorText('wrongCredentials'),
      });
    }

    const user = await User.findOne({ email });

    if (user && (await compare(password, user.password))) {
      res
        .cookie('accessToken', generateToken(user._id.toString()), {
          maxAge: 1000 * 60 * 60 * 24 * 30,
        })
        .sendApiResponse<UserResponseData>({
          ok: true,
          status: 200,
          data: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          },
        });
    } else {
      res.sendApiResponse<string>({
        ok: false,
        status: 401,
        errorMessage: res.getErrorText('wrongCredentials'),
      });
    }
  } catch (error) {
    next(error);
  }
};
