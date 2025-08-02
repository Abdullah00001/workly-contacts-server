import { Request, Response, NextFunction } from 'express';
import logger from '@/configs/logger.configs';
import UserServices from '@/modules/user/user.services';
import IUser from '@/modules/user/user.interfaces';
import CookieUtils from '@/utils/cookie.utils';
import UserMiddlewares from '@/modules/user/user.middlewares';
import {
  accessTokenExpiresIn,
  getLocationFromIP,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
} from '@/const';
import { AuthType } from '@/modules/user/user.enums';
import { env } from '@/env';
import { UAParser } from 'ua-parser-js';

const { cookieOption } = CookieUtils;
const { getRealIP } = UserMiddlewares;
const { CLIENT_BASE_URL } = env;

const {
  processSignup,
  processVerifyUser,
  processLogin,
  processTokens,
  processLogout,
  processResend,
  processFindUser,
  processSentRecoverAccountOtp,
  processVerifyOtp,
  processReSentRecoverAccountOtp,
  processResetPassword,
  processOAuthCallback,
} = UserServices;

const UserControllers = {
  /**
   * This Handle Function Is For Signup Controller
   * @param req request
   * @param res request
   * @param next next function
   * This Handler Accept name,email,password as string in req.body object.we destructure the object and pass to processSignup service.processSignup service return the created user or if error occurred throw error.
   * @returns successful user creation processSignup return us created user and we send the response with success flag,short message and in data with created user object.
   * @error on error we simply call the next function with error
   */
  handleSignUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const createdUser = await processSignup({
        name,
        email,
        password: { secret: password, change_at: new Date().toISOString() },
        provider: AuthType.LOCAL,
      });
      res.status(201).json({
        success: true,
        message: 'User signup successful',
        data: createdUser,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  handleCheck: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleVerifyUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req?.user as IUser;
      const { accessToken, refreshToken } = await processVerifyUser(user);
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.status(200).json({
        success: true,
        message: 'Email verification successful',
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  handleResend: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req?.user as IUser;
      await processResend(user);
      res.status(200).json({
        success: true,
        message: 'Verification Email Resend Successful',
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  handleLogin: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = processLogin(req.user as IUser);
      res.clearCookie('r_stp1', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleLogout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decoded;
      const { accesstoken, refreshtoken } = req.cookies;
      await processLogout({
        accessToken: accesstoken,
        refreshToken: refreshtoken,
        userId,
      });
      res.clearCookie('accesstoken', cookieOption(accessTokenExpiresIn));
      res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'Logout successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleRefreshTokens: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentRefreshToken = req.cookies?.refreshtoken;
      const { email, isVerified, name, userId } = req.decoded;
      const { accessToken, refreshToken } = await processTokens({
        userId,
        email,
        isVerified,
        name,
        refreshToken: currentRefreshToken,
      });
      res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.status(200).json({
        status: 'success',
        message: 'Token refreshed',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleFindUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const { r_stp1 } = processFindUser(user);
      res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie('r_stp1', r_stp1, cookieOption(recoverSessionExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'User Found',
        stepToken: r_stp1,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleCheckR_Stp1: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.decoded;
      res.status(200).json({
        status: 'success',
        data: { email, name, avatar },
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleCheckR_Stp2: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(204).send();
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleCheckR_Stp3: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(204).send();
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleSentRecoverOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, isVerified, name, userId, avatar } = req.decoded;
      const r_stp1 = req.cookies?.r_stp1;
      const { r_stp2 } = await processSentRecoverAccountOtp({
        email,
        isVerified,
        name,
        userId,
        avatar,
        r_stp1,
      });
      res.clearCookie('r_stp1', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie('r_stp2', r_stp2, cookieOption(recoverSessionExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'Recover Otp Send Successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleVerifyRecoverOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, isVerified, name, userId, avatar } = req.decoded;
      const r_stp2 = req.cookies?.r_stp2;
      const { r_stp3 } = await processVerifyOtp({
        email,
        isVerified,
        name,
        userId,
        avatar,
        r_stp2,
      });
      res.clearCookie('r_stp1', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie('r_stp3', r_stp3, cookieOption(recoverSessionExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'OTP verification successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleResendRecoverOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, name, userId } = req.decoded;
      await processReSentRecoverAccountOtp({ email, name, userId });
      res.status(200).json({
        status: 'success',
        message: 'OTP resent successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleResetPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password } = req.body;
      const { email, name, userId, isVerified } = req.decoded;
      const r_stp3 = req.cookies?.r_stp3;
      const ipAddress = getRealIP(req);
      let locationInfo = null;
      let location = 'Unknown';
      if (
        ipAddress &&
        ipAddress !== '::1' &&
        ipAddress !== '127.0.0.1' &&
        ipAddress.length > 5
      ) {
        try {
          locationInfo = await getLocationFromIP(ipAddress);
          if (
            locationInfo?.city &&
            locationInfo?.regionName &&
            locationInfo?.country
          ) {
            location = `${locationInfo.city}, ${locationInfo.regionName}, ${locationInfo.country}`;
          }
        } catch (locationError) {
          console.error('Location lookup failed:', locationError);
        }
      }
      const { browser, device, os } = UAParser(req.useragent?.source);
      const userDevice = `${browser.name} ${browser.version} on ${os.name}(${device.type})`;
      const { accessToken, refreshToken } = await processResetPassword({
        email,
        name,
        userId,
        isVerified,
        r_stp3,
        device: userDevice,
        ipAddress: ipAddress,
        location: location,
        password: { secret: password, change_at: new Date().toISOString() },
      });
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.status(200).json({
        status: 'success',
        message: 'Password Reset Successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleProcessOAuthCallback: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user as IUser;
    try {
      const { accessToken, refreshToken } = processOAuthCallback(user);
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.redirect(CLIENT_BASE_URL);
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default UserControllers;
