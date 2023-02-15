import { RequestHandler } from 'express';
import { genSalt, hash } from 'bcryptjs';
import { User } from '../../services/mongoDB/models/user';
import { generateToken } from './token';

import { ApiResponseBody } from '../../types';
import { UserRegisterRequestBody, UserResponseData } from './types';

export const register: RequestHandler<
  {},
  ApiResponseBody<UserResponseData>,
  UserRegisterRequestBody
> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error(res.getErrorText('includeFields'));
    }

    if (await User.findOne({ email })) {
      res.status(400);
      throw new Error(res.getErrorText('userExists'));
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      res.status(400);
      throw new Error(res.getErrorText('invalidData'));
    } else {
      const data = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      };

      res.status(201).json({
        ok: true,
        status: 201,
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};
