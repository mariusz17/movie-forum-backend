import { RequestHandler } from 'express';
import { genSalt, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../services/mongoDB/models/user';
import {
  createJwtAccessToken,
  createJwtRefreshToken,
  setTokenCookies,
} from '../../utils/token';

import { UserRegisterRequestBody, UserResponseData } from './types';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body as UserRegisterRequestBody;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error(res.getErrorText('includeFields'));
    }

    if (await User.findOne({ email })) {
      res.status(400);
      throw new Error(res.getErrorText('userExists'));
    }

    let publicId = uuidv4();

    do {
      publicId = uuidv4();
    } while (await User.findOne({ publicId }));

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await User.create({
      publicId,
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const { jwtAccessToken, accessToken } = await createJwtAccessToken(
        user._id.toString(),
        user.validAccessTokens
      );
      const { jwtRefreshToken, refreshToken } = await createJwtRefreshToken(
        user._id.toString(),
        user.validRefreshTokens
      );

      user.validRefreshTokens.push(refreshToken);
      user.validAccessTokens.push(accessToken);
      await user.save();

      setTokenCookies(res, { jwtAccessToken, jwtRefreshToken });
      res.sendApiResponse<UserResponseData>({
        ok: true,
        status: 201,
        data: {
          id: user.publicId,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400);
      throw new Error(res.getErrorText('invalidData'));
    }
  } catch (error) {
    next(error);
  }
};
