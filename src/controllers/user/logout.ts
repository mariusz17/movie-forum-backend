import { RequestHandler } from 'express';

export const logout: RequestHandler = async (req, res) => {
  if (req.verifiedUser) {
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .sendApiResponse({ ok: true, status: 204 });
  } else {
    res.status(500);
    throw new Error(res.getErrorText('internal'));
  }
};
