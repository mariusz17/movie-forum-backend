import { RequestHandler } from 'express';
import { compare } from 'bcryptjs';
import { t } from '../../services/i18n';
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
      throw new Error(t('wrongCredentials', language));
    }

    const user = await User.findOne({ email });

    if (user && (await compare(password, user.password))) {
      res.status(200).json({
        ok: true,
        status: 200,
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          token: generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(401);
      throw new Error(t('wrongCredentials', language));
    }
  } catch (error) {
    next(error);
  }
};
