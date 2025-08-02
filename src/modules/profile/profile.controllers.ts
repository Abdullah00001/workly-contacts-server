import logger from '@/configs/logger.configs';
import { accessTokenExpiresIn, refreshTokenExpiresIn } from '@/const';
import { IProfilePayload } from '@/modules/profile/profile.interfaces';
import ProfileServices from '@/modules/profile/profile.services';
import CookieUtils from '@/utils/cookie.utils';
import { NextFunction, Request, Response } from 'express';

const {
  processGetProfile,
  processUpdateProfile,
  processChangePassword,
  processDeleteAccount,
} = ProfileServices;

const { cookieOption } = CookieUtils;

const ProfileControllers = {
  handleUpdateProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const payload: IProfilePayload = req.body;
      const data = await processUpdateProfile({ ...payload, user: userId });
      res.status(200).json({
        status: 'success',
        message: 'update profile successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleGetProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decoded;
      const data = await processGetProfile({ user: userId });
      res
        .status(200)
        .json({ status: 'success', message: 'get profile successful', data });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleChangePassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password } = req.body;
      const { userId } = req.decoded;
      await processChangePassword({
        password: { secret: password, change_at: new Date().toISOString() },
        user: userId,
      });
      res
        .status(200)
        .json({ status: 'success', message: 'password change successful' });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleDeleteAccount: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.decoded;
    try {
      await processDeleteAccount({ user: userId });
      res.clearCookie('accesstoken', cookieOption(accessTokenExpiresIn));
      res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
      res
        .status(200)
        .json({ status: 'success', message: 'account delete successful' });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default ProfileControllers;
