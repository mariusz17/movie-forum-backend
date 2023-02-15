import { RequestHandler } from 'express';
import { genSalt, hash } from 'bcryptjs';
import { t } from '../../services/i18n';
import { User } from '../../services/mongoDB/models/user';
import { generateToken } from './token';

import { ApiResponseBody } from '../../types';
import { NewUserRequestBody, UserResponseData } from './types';

export const register: RequestHandler<
  {},
  ApiResponseBody<UserResponseData>,
  NewUserRequestBody
> = async (req, res, next) => {
  const language = req.acceptsLanguages()[0];

  const validateData = async (data: NewUserRequestBody) => {
    const { name, email, password } = data;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error(t('includeFields', language));
    }

    if (await User.findOne({ email })) {
      res.status(400);
      throw new Error(t('userExists', language));
    }

    return { name, email, password };
  };

  const createUser = async (
    data: NewUserRequestBody
  ): Promise<UserResponseData> => {
    const { name, email, password } = data;
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      };
    } else {
      res.status(400);
      throw new Error(t('invalidData', language));
    }
  };

  const sendResponse = (user: UserResponseData) => {
    res.status(201).json({
      ok: true,
      status: 201,
      data: user,
    });
  };

  validateData(req.body).then(createUser).then(sendResponse).catch(next);
};
