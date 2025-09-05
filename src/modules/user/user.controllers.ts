import { Request, Response, NextFunction } from 'express';
import logger from '@/configs/logger.configs';
import UserServices from '@/modules/user/user.services';
import IUser from '@/modules/user/user.interfaces';
import CookieUtils from '@/utils/cookie.utils';
import {
  accessTokenExpiresIn,
  activationTokenExpiresIn,
  changePasswordPageTokenExpiresIn,
  getLocationFromIP,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
} from '@/const';
import { ActivityType, AuthType } from '@/modules/user/user.enums';
import { env } from '@/env';
import { UAParser } from 'ua-parser-js';
import ExtractMetaData from '@/utils/metaData.utils';
import { Types } from 'mongoose';
import { CreateUserResponseDTO } from '@/modules/user/user.dto';
import { TokenPayload } from '@/interfaces/jwtPayload.interfaces';
import { TRequestUser } from '@/types/express';

const { cookieOption } = CookieUtils;
const { getRealIP, getClientMetaData } = ExtractMetaData;
const { CLIENT_BASE_URL } = env;

const {
  processSignup,
  processVerifyUser,
  processLogin,
  processRefreshToken,
  processLogout,
  processResend,
  // processFindUser,
  // processSentRecoverAccountOtp,
  // processVerifyOtp,
  // processReSentRecoverAccountOtp,
  // processResetPassword,
  processOAuthCallback,
  processAccountActivation,
  processChangePasswordAndAccountActivation,
} = UserServices;

const UserControllers = {
  /**
   * This Handle Function Is For Signup Controller
   * @param req request
   * @param res request
   * @param next next function
   * This Handler Accept name,email,password as string in req.body object.we destructure the object and pass to processSignup service.processSignup service return the created user or if error occurred throw error.
   * @returns successful user creation processSignup return us created user and we send the response with activation token in cookie and with success flag,short message and in data with created user object.
   * @error on error we simply call the next function with error
   */
  handleSignUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const { activationToken, createdUser } = await processSignup({
        name,
        email,
        password: { secret: password, change_at: new Date().toISOString() },
        provider: AuthType.LOCAL,
      });
      const createdUserData = CreateUserResponseDTO.fromEntity(createdUser);
      res.cookie(
        'actv_token',
        activationToken,
        cookieOption(activationTokenExpiresIn)
      );
      res.status(201).json({
        success: true,
        message: 'User created',
        data: createdUserData,
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
      const { sub } = req?.decoded as TokenPayload;
      const { browser, device, location, os, ip } =
        await getClientMetaData(req);
      const { accessToken, refreshToken } = await processVerifyUser({
        browser: browser.name as string,
        deviceType: device.type || 'desktop',
        userId: sub,
        ipAddress: ip,
        location: `${location.city} ${location.country}`,
        os: os.name as string,
      });
      res.clearCookie('actv_token', cookieOption(activationTokenExpiresIn));
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
      const { sub } = req?.decoded;
      await processResend(sub);
      res.status(200).json({
        success: true,
        message: 'Verification Email Resend Successful',
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  handleLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req.user as TRequestUser;
      const { browser, device, location, os, ip } =
        await getClientMetaData(req);
      const { accessToken, refreshToken } = await processLogin({
        browser: browser.name as string,
        deviceType: device.type || 'desktop',
        ipAddress: ip,
        location: `${location.city} ${location.country}`,
        os: os.name as string,
        user,
      });
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
      const { sub, sid } = req.decoded;
      const { accesstoken, refreshtoken } = req.cookies;
      await processLogout({
        accessToken: accesstoken,
        refreshToken: refreshtoken,
        userId: sub,
        sid: sid as string,
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
  handleRefreshTokens: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sid, userId } = req.decoded;
      const { accessToken } = processRefreshToken({
        userId,
        sid: sid as string,
      });
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
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
  // handleFindUser: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const user = req.user as IUser;
  //     const { r_stp1 } = processFindUser(user);
  //     res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
  //     res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
  //     res.cookie('r_stp1', r_stp1, cookieOption(recoverSessionExpiresIn));
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'User Found',
  //       stepToken: r_stp1,
  //     });
  //     return;
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(error);
  //   }
  // },
  // handleCheckR_Stp1: (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { email, name, avatar } = req.decoded;
  //     res.status(200).json({
  //       status: 'success',
  //       data: { email, name, avatar },
  //     });
  //     return;
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(error);
  //   }
  // },
  // handleCheckR_Stp2: (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     res.status(204).send();
  //     return;
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(error);
  //   }
  // },
  // handleCheckR_Stp3: (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     res.status(204).send();
  //     return;
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(error);
  //   }
  // },
  // handleSentRecoverOtp: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { email, isVerified, name, userId, avatar } = req.decoded;
  //     const r_stp1 = req.cookies?.r_stp1;
  //     const { r_stp2 } = await processSentRecoverAccountOtp({
  //       email,
  //       isVerified,
  //       name,
  //       userId,
  //       avatar,
  //       r_stp1,
  //     });
  //     res.clearCookie('r_stp1', cookieOption(recoverSessionExpiresIn));
  //     res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
  //     res.cookie('r_stp2', r_stp2, cookieOption(recoverSessionExpiresIn));
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'Recover Otp Send Successful',
  //     });
  //     return;
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(error);
  //   }
  // },
  // handleVerifyRecoverOtp: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { email, isVerified, name, userId, avatar } = req.decoded;
  //     const r_stp2 = req.cookies?.r_stp2;
  //     const { r_stp3 } = await processVerifyOtp({
  //       email,
  //       isVerified,
  //       name,
  //       userId,
  //       avatar,
  //       r_stp2,
  //     });
  //     res.clearCookie('r_stp1', cookieOption(recoverSessionExpiresIn));
  //     res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
  //     res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
  //     res.cookie('r_stp3', r_stp3, cookieOption(recoverSessionExpiresIn));
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'OTP verification successful',
  //     });
  //     return;
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(error);
  //   }
  // },
  // handleResendRecoverOtp: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { email, name, userId } = req.decoded;
  //     await processReSentRecoverAccountOtp({ email, name, userId });
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'OTP resent successful',
  //     });
  //     return;
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(error);
  //   }
  // },
  // handleResetPassword: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { password } = req.body;
  //     const { email, name, userId, isVerified } = req.decoded;
  //     const r_stp3 = req.cookies?.r_stp3;
  //     const ipAddress = getRealIP(req);
  //     let locationInfo = null;
  //     let location = 'Unknown';
  //     if (
  //       ipAddress &&
  //       ipAddress !== '::1' &&
  //       ipAddress !== '127.0.0.1' &&
  //       ipAddress.length > 5
  //     ) {
  //       try {
  //         locationInfo = await getLocationFromIP(ipAddress);
  //         if (
  //           locationInfo?.city &&
  //           locationInfo?.regionName &&
  //           locationInfo?.country
  //         ) {
  //           location = `${locationInfo.city}, ${locationInfo.regionName}, ${locationInfo.country}`;
  //         }
  //       } catch (locationError) {
  //         console.error('Location lookup failed:', locationError);
  //       }
  //     }
  //     const { browser, device, os } = UAParser(req.useragent?.source);
  //     const userDevice = `${browser.name} ${browser.version} on ${os.name}(${device.type})`;
  //     const { accessToken, refreshToken } = await processResetPassword({
  //       email,
  //       name,
  //       userId,
  //       isVerified,
  //       r_stp3,
  //       device: userDevice,
  //       ipAddress: ipAddress,
  //       location: location,
  //       password: { secret: password, change_at: new Date().toISOString() },
  //     });
  //     res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
  //     res.cookie(
  //       'accesstoken',
  //       accessToken,
  //       cookieOption(accessTokenExpiresIn)
  //     );
  //     res.cookie(
  //       'refreshtoken',
  //       refreshToken,
  //       cookieOption(refreshTokenExpiresIn)
  //     );
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'Password Reset Successful',
  //     });
  //     return;
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(error);
  //   }
  // },
  handleProcessOAuthCallback: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { user, activity } = req.user as TRequestUser;
    try {
      const { browser, device, location, os, ip } =
        await getClientMetaData(req);
      const { accessToken, refreshToken } = await processOAuthCallback({
        user,
        activity: activity as ActivityType,
        browser: browser.name as string,
        deviceType: device.type || 'desktop',
        ipAddress: ip,
        location: `${location.city} ${location.country}`,
        os: os.name as string,
      });
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
  /**
   * This handle function is for account activation
   * @param req Request param for getting request details and data
   * @param res Response param for getting response details and data
   * @param next Next param for passing the request to next function
   * This handler didn't accept any data in body and query.Its only accept data in request params,An valid uuid token.
   * @return Its return an success response or error response base on query
   * @error Its throw global error if any incident happened during database query
   */
  handleAccountActivation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { uuid } = req.params;
      const userId = req.user as string;
      const token = processAccountActivation(userId);
      res.cookie(
        '__actvwithcngpass',
        token,
        cookieOption(changePasswordPageTokenExpiresIn)
      );
      res.redirect(`${CLIENT_BASE_URL}/activation/change/${uuid}`);
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleCheckChangePasswordPageToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json({ success: true, message: 'Token is valid' });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleChangePasswordAndAccountActivation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { browser, device, location, os, ip } =
        await getClientMetaData(req);
      const { password } = req.body;
      const token = req.cookies.__actvwithcngpass;
      const userId = req.user;
      const { uuid } = req.params;
      await processChangePasswordAndAccountActivation({
        userId: userId as string,
        token,
        uuid,
        password,
        browser: browser.name as string,
        deviceType: device.type || 'desktop',
        ipAddress: ip,
        location: `${location.city} ${location.country}`,
        os: os.name as string,
      });
      res.clearCookie(
        '__actvwithcngpass',
        cookieOption(changePasswordPageTokenExpiresIn)
      );
      res
        .status(200)
        .json({ success: true, message: 'Account activation complete' });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default UserControllers;
