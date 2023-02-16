import { RequestHandler } from 'express';
import { compare } from 'bcryptjs';
import { User } from '../../services/mongoDB/models/user';
import { generateToken } from './token';

import { UserLoginRequestBody, UserResponseData } from './types';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as UserLoginRequestBody;

    if (!email || !password) {
      res.status(401);
      throw new Error(res.getErrorText('wrongCredentials'));
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
            publicId: user.publicId,
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
