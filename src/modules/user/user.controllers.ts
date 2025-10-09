import { Request, Response, NextFunction } from 'express';
import logger from '@/configs/logger.configs';
import UserServices from '@/modules/user/user.services';
import IUser from '@/modules/user/user.interfaces';
import CookieUtils from '@/utils/cookie.utils';
import {
  accessTokenExpiresIn,
  activationTokenExpiresIn,
  changePasswordPageTokenExpiresIn,
  clearDevicePageTokenExpireIn,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
  refreshTokenExpiresInWithoutRememberMe,
} from '@/const';
import { ActivityType, AuthType } from '@/modules/user/user.enums';
import { env } from '@/env';
import ExtractMetaData from '@/utils/metaData.utils';
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
  processCheckResendStatus,
  processFindUser,
  processSentRecoverAccountOtp,
  processVerifyOtp,
  processReSentRecoverAccountOtp,
  processResetPassword,
  processOAuthCallback,
  processAccountActivation,
  processChangePasswordAndAccountActivation,
  processRetrieveSessionsForClearDevice,
  processClearDeviceAndLogin,
  processRecoverUserInfo,
  processSecurityOverview,
  processActiveSessions,
  processRecentActivityData,
  processSessionRemove,
  processRetrieveActivity,
  processRetrieveActivityDetails,
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
  /**
   *
   */
  handleCheckActivationTokenValidity: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json({
        success: true,
        message: 'Token Is Valid',
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  /**
   * Verify User Signup User Email
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   */
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
  /**
   * Resend The Otp For Verify Signup User Email
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  handleResend: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const availableAt = req.availableAt;
      const { sub } = req.decoded;
      await processResend(sub);
      res.status(200).json({
        success: true,
        message: 'Verification Email Resend Successful',
        data: { availableAt },
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  handleCheckResendStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sub } = req.decoded;
    try {
      const data = await processCheckResendStatus({ userId: sub });
      res.status(200).json({
        success: true,
        message: 'Availability check successful',
        data,
      });
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  /**
   * AccessToken Check Handler
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  handleCheck: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleRetrieveSessionsForClearDevice: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub } = req.decoded;
      const sessions = await processRetrieveSessionsForClearDevice({
        userId: sub as string,
      });
      res.status(200).json({
        success: true,
        message: 'Sessions retrieve successful',
        data: sessions,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleClearDeviceAndLogin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub, rememberMe, provider } = req.decoded;
      const { devices } = req.body;
      const { browser, device, location, os, ip } =
        await getClientMetaData(req);
      const { accessToken, refreshToken } = await processClearDeviceAndLogin({
        browser: browser.name as string,
        deviceType: device.type || 'desktop',
        ipAddress: ip,
        location: `${location.city} ${location.country}`,
        os: os.name as string,
        user: sub as string,
        rememberMe,
        devices: devices,
        provider,
      });
      const refreshTokenCookieExpiresIn =
        rememberMe || provider === AuthType.GOOGLE
          ? refreshTokenExpiresIn
          : refreshTokenExpiresInWithoutRememberMe;
      res.clearCookie(
        '__clear_device',
        cookieOption(clearDevicePageTokenExpireIn)
      );
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenCookieExpiresIn)
      );
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req.user as TRequestUser;
      const { rememberMe } = req.body;
      const { browser, device, location, os, ip } =
        await getClientMetaData(req);
      const { accessToken, refreshToken } = await processLogin({
        browser: browser.name as string,
        deviceType: device.type || 'desktop',
        ipAddress: ip,
        location: `${location.city} ${location.country}`,
        os: os.name as string,
        user,
        rememberMe,
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
        cookieOption(
          rememberMe
            ? refreshTokenExpiresIn
            : refreshTokenExpiresInWithoutRememberMe
        )
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
  /**
   * Handler to log out a user and invalidate their session.
   *
   * Responsibilities:
   * - Extracts `sub` (user ID) and `sid` (session ID) from the decoded token.
   * - Calls `processLogout` to revoke the access and refresh tokens in Redis.
   * - Clears authentication cookies (`accesstoken`, `refreshtoken`).
   * - Responds with a 200 status and a success message on completion.
   *
   * @param req - Express request object (must include `decoded`)
   * @param res - Express response object
   * @param next - Express next middleware function
   */

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
  handleRefreshTokens: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sid, sub } = req.decoded;
      const { accessToken } = await processRefreshToken({
        userId: sub,
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
  handleFindUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req.user as TRequestUser;
      const { _id, name, avatar, email } = user as IUser;
      const { r_stp1 } = processFindUser({ userId: _id as string });
      res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie('r_stp1', r_stp1, cookieOption(recoverSessionExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'User Found',
        data: { name, avatar, email },
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
      res.status(200).json({
        status: true,
        message: 'Step One Validate',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleRecoverUserInfo: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub } = req.decoded;
      const data = await processRecoverUserInfo(sub);
      res.status(200).json({
        success: true,
        message: 'user data retrieve successful',
        data,
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
      res.status(200).json({
        status: true,
        message: 'Step One Validate',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleCheckR_Stp3: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        status: true,
        message: 'Step One Validate',
      });
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
      const { sub } = req.decoded;
      const r_stp1 = req.cookies?.r_stp1;
      const { r_stp2 } = await processSentRecoverAccountOtp({
        userId: sub,
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
      const { sub } = req.decoded;
      const r_stp2 = req.cookies?.r_stp2;
      const { r_stp3 } = await processVerifyOtp({
        userId: sub,
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
      const availableAt = req.availableAt;
      const { sub } = req.decoded;
      await processReSentRecoverAccountOtp({ userId: sub });
      res.status(200).json({
        status: 'success',
        message: 'OTP resent successful',
        data: { availableAt },
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
      const { sub } = req.decoded;
      const r_stp3 = req.cookies?.r_stp3;
      const { browser, device, location, os, ip } =
        await getClientMetaData(req);
      await processResetPassword({
        browser: browser.name as string,
        deviceType: device.type || 'desktop',
        userId: sub,
        ipAddress: ip,
        location: `${location.city} ${location.country}`,
        os: os.name as string,
        password,
        r_stp3,
      });
      res.clearCookie('r_stp1', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
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
  handleCheckClearDevicePageToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json({ success: true, message: 'Token Is Validate' });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleSecurityOverview: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub } = req.decoded;
      const data = await processSecurityOverview(sub);
      res.status(200).json({
        success: true,
        message: 'Security overview data retrieve successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleActiveSession: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub, sid } = req.decoded;
      const data = await processActiveSessions({ sid: sid as string, sub });
      res.status(200).json({
        success: true,
        message: 'Active session data retrieve successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleRecentActivity: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub } = req.decoded;
      const data = await processRecentActivityData(sub);
      res.status(200).json({
        success: true,
        message: 'Recent Activity Retrieve Successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleSessionRemove: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub, sid } = req.decoded;
      const { sessionId } = req.body;
      const data = await processSessionRemove({
        sessionId,
        sid: sid as string,
        sub,
      });
      res
        .status(200)
        .json({ success: true, message: 'Session Has Removed', data });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleForceLogout: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('accesstoken', cookieOption(accessTokenExpiresIn));
      res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
      res
        .status(200)
        .json({ success: true, message: 'Force Logout Successful' });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleRetrieveActivity: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub } = req.decoded;
      const data = await processRetrieveActivity(sub);
      res
        .status(200)
        .json({ success: true, message: 'Activity Retrieve Successful', data });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleRetrieveActivityDetails: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {id}=req.params
      const data = await processRetrieveActivityDetails(id);
      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Activity Details Not Found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Activity Details Retrieve Successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default UserControllers;
