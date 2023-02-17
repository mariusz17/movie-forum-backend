import { RequestHandler } from 'express';
import { User } from '../../services/mongoDB/models/user';

export const logoutAll: RequestHandler = async (req, res, next) => {
  try {
    if (req.verifiedUser) {
      const user = await User.findById(req.verifiedUser.privateId);

      if (user) {
        user.validAccessTokens = [];
        user.validRefreshTokens = [];
        user.isLoggedOut = true;
        await user.save();

        res
          .clearCookie('accessToken')
          .clearCookie('refreshToken')
          .sendApiResponse({ ok: true, status: 204 });
      } else {
        res.status(500);
        throw new Error(res.getErrorText('internal'));
      }
    } else {
      res.status(500);
      throw new Error(res.getErrorText('internal'));
    }
  } catch (error) {
    next(error);
  }
};
