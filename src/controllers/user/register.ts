import { RequestHandler } from 'express';
import { genSalt, hash } from 'bcryptjs';
import { User } from '../../services/mongoDB/models/user';
import { generateToken } from './token';

import { UserRegisterRequestBody, UserResponseData } from './types';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body as UserRegisterRequestBody;

    if (!name || !email || !password) {
      res.sendApiResponse({
        ok: false,
        status: 400,
        errorMessage: res.getErrorText('includeFields'),
      });
    }

    if (await User.findOne({ email })) {
      res.sendApiResponse({
        ok: false,
        status: 400,
        errorMessage: res.getErrorText('userExists'),
      });
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res
        .cookie('accessToken', generateToken(user._id.toString()), {
          maxAge: 1000 * 60 * 60 * 24 * 30,
        })
        .sendApiResponse<UserResponseData>({
          ok: true,
          status: 201,
          data: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          },
        });
    } else {
      res.sendApiResponse({
        ok: false,
        status: 400,
        errorMessage: res.getErrorText('invalidData'),
      });
    }
  } catch (error) {
    next(error);
  }
};
