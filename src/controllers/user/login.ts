import { RequestHandler } from 'express';
import { compare } from 'bcryptjs';
import { User } from '../../services/mongoDB/models/user';
import { generateToken } from './token';

import { ApiResponseBody } from '../../types';
import { UserLoginRequestBody, UserResponseData } from './types';

export const login: RequestHandler<
  {},
  ApiResponseBody<UserResponseData>,
  UserLoginRequestBody
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const language = req.acceptsLanguages()[0];

    if (!email || !password) {
      res.status(401);
      throw new Error(res.getErrorText('wrongCredentials'));
    }

    const user = await User.findOne({ email });

    if (user && (await compare(password, user.password))) {
      res
        .status(200)
        .cookie('accessToken', generateToken(user._id.toString()), {
          maxAge: 1000 * 60 * 60 * 24 * 30,
        })
        .json({
          ok: true,
          status: 200,
          data: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          },
        });
    } else {
      res.status(401);
      throw new Error(res.getErrorText('wrongCredentials'));
    }
  } catch (error) {
    next(error);
  }
};
