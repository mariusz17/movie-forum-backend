import { RequestHandler } from 'express';
import { compare } from 'bcryptjs';
import { User } from '../../services/mongoDB/models/user';
import {
  createJwtAccessToken,
  createJwtRefreshToken,
  setTokenCookies,
} from '../../utils/token';

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
      const { jwtAccessToken, accessToken } = await createJwtAccessToken(
        user._id.toString(),
        user.validAccessTokens
      );
      const { jwtRefreshToken, refreshToken } = await createJwtRefreshToken(
        user._id.toString(),
        user.validRefreshTokens
      );

      user.isLoggedOut = false;
      user.validRefreshTokens.push(refreshToken);
      user.validAccessTokens.push(accessToken);
      await user.save();

      setTokenCookies(res, { jwtAccessToken, jwtRefreshToken });
      res.sendApiResponse<UserResponseData>({
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
