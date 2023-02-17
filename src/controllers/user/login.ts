import { RequestHandler } from 'express';
import { compare } from 'bcryptjs';
import { User } from '../../services/mongoDB/models/user';
import { createJwtAccessToken, createJwtRefreshToken } from '../../utils/token';

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
      const jwtAccessToken = await createJwtAccessToken(user._id.toString());
      const { jwtRefreshToken, refreshToken } = await createJwtRefreshToken(
        user._id.toString(),
        user.validRefreshTokens
      );

      user.isLoggedOut = false;
      user.validRefreshTokens.push(refreshToken);
      await user.save();

      res
        .cookie('accessToken', jwtAccessToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
        })
        .cookie('refreshToken', jwtRefreshToken, {
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
