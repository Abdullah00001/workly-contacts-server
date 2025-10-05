import logger from '@/configs/logger.configs';
import redisClient from '@/configs/redis.configs';
import UserRepositories from '@/modules/user/user.repositories';
import { NextFunction, Request, Response } from 'express';
import IUser, {
  IActivityPayload,
  TAccountLockedEmailPayload,
} from '@/modules/user/user.interfaces';
import PasswordUtils from '@/utils/password.utils';
import { TokenPayload } from '@/interfaces/jwtPayload.interfaces';
import JwtUtils from '@/utils/jwt.utils';
import EmailQueueJobs from '@/queue/jobs/email.jobs';
import ActivityQueueJobs from '@/queue/jobs/activity.jobs';
import ExtractMetaData from '@/utils/metaData.utils';
import { ILoginEmailPayload } from '@/interfaces/securityEmail.interfaces';
import {
  AccountStatus,
  ActivityType,
  AuthType,
} from '@/modules/user/user.enums';
import { Types } from 'mongoose';
import {
  accessTokenExpiresIn,
  AccountActivityMap,
  baseUrl,
  clearDevicePageTokenExpireIn,
  maxOtpResendPerHour,
  otpRateLimitMaxCount,
  otpRateLimitSlidingWindow,
  refreshTokenExpiresIn,
  resendOtpEmailCoolDownWindow,
} from '@/const';
import DateUtils from '@/utils/date.utils';
import { OtpUtilsSingleton } from '@/singletons';
import CalculationUtils from '@/utils/calculation.utils';
import CookieUtils from '@/utils/cookie.utils';
import axios from 'axios';
import { env } from '@/env';
import { v4 as uuidv4 } from 'uuid';
import { TRequestUser } from '@/types/express';

const { comparePassword } = PasswordUtils;
const { findUserByEmail, updateUserAccountStatus } = UserRepositories;
const {
  verifyAccessToken,
  verifyRefreshToken,
  verifyRecoverToken,
  verifyActivationToken,
  verifyChangePasswordPageToken,
  generateClearDevicePageToken,
  verifyClearDevicePageToken,
} = JwtUtils;
const { sharedCookieOption, cookieOption } = CookieUtils;
const {
  loginFailedNotificationEmailToQueue,
  addAccountLockNotificationToQueue,
} = EmailQueueJobs;
const { loginFailedActivitySavedInDb, accountLockActivitySavedInDb } =
  ActivityQueueJobs;
const { getClientMetaData, getRealIP } = ExtractMetaData;
const { formatDateTime } = DateUtils;
const otpUtils = OtpUtilsSingleton();
const { expiresInTimeUnitToMs } = CalculationUtils;
const UserMiddlewares = {
  isSignupUserExist: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const isUser = await findUserByEmail(email);
      if (isUser) {
        res.status(409).json({ success: false, message: 'User already exist' });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In isSignupUser Exist Middleware');
        next(error);
      }
    }
  },
  isUserExistAndVerified: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const isUserExist = await findUserByEmail(email);
      if (!isUserExist) {
        res.status(401).json({
          success: false,
          message: 'Invalid Credential,Check Your Email And Password',
        });
        return;
      }
      if (!isUserExist.isVerified) {
        res.status(403).json({ success: false, message: 'User Not Verified' });
        return;
      }
      req.user = { user: isUserExist } as TRequestUser;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error(
          'Unknown Error Occurred In isUser Exist and Verified Middleware'
        );
        next(error);
      }
    }
  },
  isUserExist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const isUserExist = await findUserByEmail(email);
      if (!isUserExist) {
        res.status(404).json({ success: false, message: 'User Not Found' });
        return;
      }
      req.user = { user: isUserExist } as TRequestUser;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In isUser Exist Middleware');
        next(error);
      }
    }
  },
  isUserVerified: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isVerified } = (req.user as TRequestUser)?.user as IUser;
      if (!isVerified) {
        res
          .status(403)
          .json({ success: false, message: 'Email With User Not Verified' });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In isUserVerified Middleware');
        next(error);
      }
    }
  },
  checkOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp } = req.body;
      const { sub } = req?.decoded as TokenPayload;
      const hashedOtp = await redisClient.get(`user:otp:${sub}`);
      if (!hashedOtp) {
        res
          .status(400)
          .json({ success: false, message: 'Otp has been expired' });
        return;
      }
      if (otpUtils.compareOtp({ hashedOtp, otp }) === false) {
        res.status(400).json({ success: false, message: 'Invalid otp' });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check Otp Middleware');
        next(error);
      }
    }
  },
  checkRecoverOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp } = req.body;
      const { sub } = req.decoded;
      const storedOtp = await redisClient.get(`user:recover:otp:${sub}`);
      if (!storedOtp) {
        res
          .status(400)
          .json({ success: false, message: 'Otp has been expired' });
        return;
      }
      if (storedOtp !== otp) {
        res.status(400).json({ success: false, message: 'Invalid otp' });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check Otp Middleware');
        next(error);
      }
    }
  },
  checkPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, _id } = (req.user as TRequestUser)
        ?.user as IUser;
      const key = `user:login:attempts:${email}`;
      if (!(await comparePassword(req?.body?.password, password.secret))) {
        await redisClient.set(key, 0, 'PX', expiresInTimeUnitToMs('24h'), 'NX');
        const attemptCount = await redisClient.incr(key);
        if (attemptCount === 3) {
          const { browser, device, location, os, ip } =
            await getClientMetaData(req);
          const emailPayload: ILoginEmailPayload = {
            name,
            email,
            browser: browser.name as string,
            device: device.type || 'desktop',
            ip,
            os: os.name as string,
            location: `${location.city} ${location.country}`,
            time: formatDateTime(new Date().toISOString()),
          };
          const activityPayload: IActivityPayload = {
            browser: browser.name as string,
            device: device.type || 'desktop',
            os: os.name as string,
            location: `${location.city} ${location.country}`,
            ipAddress: ip,
            activityType: ActivityType.LOGIN_FAILED,
            user: _id as Types.ObjectId,
            title: AccountActivityMap.LOGIN_FAILED.title,
            description: AccountActivityMap.LOGIN_FAILED.description,
          };
          await Promise.all([
            updateUserAccountStatus({
              userId: _id as Types.ObjectId,
              accountStatus: AccountStatus.ON_RISK,
            }),
            loginFailedNotificationEmailToQueue(emailPayload),
            loginFailedActivitySavedInDb(activityPayload),
          ]);
          res.cookie('__cptchaRequired', true, sharedCookieOption());
        }
        if (attemptCount === 9) {
          const { browser, device, location, os, ip } =
            await getClientMetaData(req);
          const activityPayload: IActivityPayload = {
            activityType: ActivityType.ACCOUNT_LOCKED,
            title: AccountActivityMap.ACCOUNT_LOCKED.title,
            description: AccountActivityMap.ACCOUNT_LOCKED.description,
            browser: browser.name as string,
            device: device.type || 'desktop',
            ipAddress: ip,
            location: `${location.city} ${location.country}`,
            os: os.name as string,
            user: _id as Types.ObjectId,
          };
          const uuid = uuidv4();
          const emailData: TAccountLockedEmailPayload = {
            name,
            email,
            time: formatDateTime(new Date().toISOString()),
            activeLink: `${env.SERVER_BASE_URL}${baseUrl.v1}/auth/active/${uuid}`,
          };
          const pipeline = redisClient.pipeline();
          await updateUserAccountStatus({
            userId: _id as Types.ObjectId,
            accountStatus: AccountStatus.LOCKED,
            lockedAt: new Date().toISOString(),
          });
          pipeline.set(
            `blacklist:ip:${ip}`,
            ip,
            'PX',
            expiresInTimeUnitToMs('1d')
          );
          const sessions = await redisClient.smembers(`user:${_id}:sessions`);
          pipeline.del(`user:${_id}:sessions`);
          sessions.forEach((sid) => {
            pipeline.del(`user:${_id}:sessions:${sid}`);
          });
          pipeline.set(
            `user:activation:uuid:${uuid}`,
            _id as string,
            'PX',
            expiresInTimeUnitToMs('1d')
          );
          await Promise.all([
            pipeline.exec(),
            addAccountLockNotificationToQueue(emailData),
            accountLockActivitySavedInDb(activityPayload),
          ]);
          res.status(401).json({
            success: false,
            message:
              'Your account has been locked,Check your email we sent yor email for more information,Or contact our support',
          });
          return;
        }
        res.status(401).json({
          success: false,
          message: 'Invalid Credential,Check Your Email And Password',
        });
        return;
      }
      await redisClient.del(key);
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check Password Middleware');
        next(error);
      }
    }
  },
  checkSessionsLimit: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user, provider } = req.user as TRequestUser;
      const { _id } = user;
      const sessions = await redisClient.smembers(`user:${_id}:sessions`);
      if (sessions.length === 3) {
        let token;
        if (provider === AuthType.GOOGLE) {
          token = generateClearDevicePageToken({
            sub: _id as string,
            provider,
          });
        } else {
          const rememberMe = req.body?.rememberMe;
          token = generateClearDevicePageToken({
            sub: _id as string,
            rememberMe,
          });
        }
        res.cookie(
          '__clear_device',
          token,
          cookieOption(clearDevicePageTokenExpireIn)
        );
        if (provider === AuthType.GOOGLE) {
          res.redirect(`${env.CLIENT_BASE_URL}/auth/clear-session`);
        }
        res.status(429).json({ success: false, message: 'Login limit exceed' });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error(
          'Unknown Error Occurred In Check Session Limit Middleware'
        );
        next(error);
      }
    }
  },
  checkClearDevicePageToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies?.__clear_device;
      const isExist = await redisClient.exists(`blacklist:jwt:${token}`);
      if (isExist) {
        res.status(403).json({ success: false, message: 'Token expired' });
        return;
      }
      if (!token) {
        res.status(403).json({ success: false, message: 'Token expired' });
        return;
      }
      const decoded = verifyClearDevicePageToken(token);
      if (!decoded) {
        res
          .status(403)
          .json({ success: false, message: 'Token expired or invalid' });
        return;
      }
      req.decoded = decoded as TokenPayload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error(
          'Unknown Error Occurred In Check Session Limit Middleware'
        );
        next(error);
      }
    }
  },
  checkActiveToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;
      // const isBlacklist=await redisClient.exists(`blacklist:uuid:${uuid}`);

      const isExist = await redisClient.get(`user:activation:uuid:${uuid}`);
      if (!isExist) {
        res.redirect(`${env.CLIENT_BASE_URL}/activation/${uuid}`);
        return;
      }
      req.user = isExist;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check Active Token Middleware');
        next(error);
      }
    }
  },
  checkChangePasswordPageToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies?.__actvwithcngpass;
      const isExist = await redisClient.exists(`blacklist:jwt:${token}`);
      if (isExist) {
        res.status(403).json({ success: false, message: 'Token expired' });
        return;
      }
      if (!token) {
        res.status(403).json({ success: false, message: 'Token expired' });
        return;
      }
      const decoded = verifyChangePasswordPageToken(token);
      if (!decoded) {
        res
          .status(403)
          .json({ success: false, message: 'Token expired or invalid' });
        return;
      }
      req.user = decoded.sub as string;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check Active Token Middleware');
        next(error);
      }
    }
  },
  /**
   * Middleware to validate the user's access token.
   *
   * - Ensures an access token exists in cookies.
   * - Checks if the token is blacklisted (revoked).
   * - Verifies token validity (expiration, signature).
   * - Attaches the decoded payload to `req.decoded` on success.
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  checkAccessToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.cookies?.accesstoken;
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Access Token is missing',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(`blacklist:jwt:${token}`);
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Accesstoken has been revoked',
        });
        return;
      }
      const decoded = verifyAccessToken(token);
      if (!decoded) {
        res.clearCookie('accesstoken', cookieOption(accessTokenExpiresIn));
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Access Token expired or invalid',
        });
        return;
      }
      req.decoded = decoded as TokenPayload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check Access Token Middleware');
        next(error);
      }
    }
  },
  /**
   * Middleware to validate the user's session extracted from the refresh token.
   *
   * Responsibilities:
   * - Checks if the session ID (`sid`) is blacklisted (revoked/expired).
   * - Validates that the session still exists in Redis.
   * - Cleans up invalid session references and clears cookies if necessary.
   * - Proceeds to the next middleware if the session is valid.
   *
   * Possible responses:
   * - 401 Unauthorized → if the session is blacklisted or expired.
   *
   * @param req - Express request object (must include `decoded` with `sid` and `sub`)
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  checkSession: async (req: Request, res: Response, next: NextFunction) => {
    const isLogoutEndpoint = req.path === '/auth/logout';
    try {
      const { sid, sub } = req.decoded;
      const isBlacklisted = await redisClient.exists(
        `blacklist:sessions:${sid}`
      );
      const isExists = await redisClient.exists(`user:${sub}:sessions:${sid}`);
      if (isLogoutEndpoint && !isExists && !isBlacklisted) {
        const accessToken = req?.cookies?.accesstoken;
        await redisClient.srem(`user:${sub}:sessions`, sid as string);
        await redisClient.set(
          `blacklist:jwt:${accessToken}`,
          accessToken!,
          'PX',
          expiresInTimeUnitToMs(accessTokenExpiresIn)
        );
        res.clearCookie('accesstoken', cookieOption(accessTokenExpiresIn));
        res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
        res.status(200).json({
          status: 'success',
          message: 'Logout successful',
        });
        return;
      }
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Session has expired,Login Required!',
        });
        return;
      }
      if (!isExists) {
        await redisClient.srem(`user:${sub}:sessions`, sid as string);
        res.clearCookie('accesstoken', cookieOption(accessTokenExpiresIn));
        res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
        res.status(440).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Session has been expired,Login Required!',
        });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check Session Middleware');
        next(error);
      }
    }
  },
  /**
   * Middleware to validate the refresh token.
   *
   * Responsibilities:
   * - Ensures a refresh token exists in cookies.
   * - Checks if the token is blacklisted (revoked).
   * - Verifies token validity (expiration, signature).
   * - Attaches the decoded payload to `req.decoded` if valid.
   * - Allows the server to issue a new access token based on a valid session.
   *
   * Possible responses:
   * - 401 Unauthorized → if the token is missing, revoked, or invalid/expired.
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   */

  checkRefreshToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies?.refreshtoken;
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Refresh Token is missing',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(`blacklist:jwt:${token}`);
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Refresh Token has been revoked',
        });
        return;
      }
      const decoded = verifyRefreshToken(token);
      if (!decoded) {
        res.clearCookie('accesstoken', cookieOption(accessTokenExpiresIn));
        res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Refresh Token expired or invalid',
        });
        return;
      }
      req.decoded = decoded as TokenPayload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error(
          'Unknown Error Occurred In Check Refresh Token Middleware'
        );
        next(error);
      }
    }
  },
  /**
   * This Middleware For Recover Account Step 1 Token Check So That Step 1 Will Secure And Prevent Unwanted Situation
   * @param req Http Request Container
   * @param res Http Response Container
   */
  checkR_stp1Token: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.cookies?.r_stp1;
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(`blacklist:r_stp1:${token}`);
      if (isBlacklisted) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
        });
        return;
      }
      const decoded = verifyRecoverToken(token);
      if (!decoded) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
        });
        return;
      }
      req.decoded = decoded as TokenPayload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check r_stp1 Token Middleware');
        next(error);
      }
    }
  },
  /**
   * This Middleware For Recover Account Step 2 Token Check So That Step 2 Will Secure And Prevent Unwanted Situation
   * @param req Http Request Container
   * @param res Http Response Container
   */
  checkR_stp2Token: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.cookies?.r_stp2;
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(`blacklist:r_stp2:${token}`);
      if (isBlacklisted) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
        });
        return;
      }
      const decoded = verifyRecoverToken(token);
      if (!decoded) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
        });
        return;
      }
      req.decoded = decoded as TokenPayload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check r_stp2 Token Middleware');
        next(error);
      }
    }
  },
  /**
   * This Middleware For Recover Account Step 3 Token Check So That Step 3 Will Secure And Prevent Unwanted Situation
   * @param req Http Request Container
   * @param res Http Response Container
   */
  checkR_stp3Token: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.cookies?.r_stp3;
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(`blacklist:r_stp3:${token}`);
      if (isBlacklisted) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
        });
        return;
      }
      const decoded = verifyRecoverToken(token);
      if (!decoded) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
        });
        return;
      }
      req.decoded = decoded as TokenPayload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check r_stp3 Token Middleware');
        next(error);
      }
    }
  },
  otpRateLimiter: async (req: Request, res: Response, next: NextFunction) => {
    const { sub } = req.decoded as TokenPayload;
    const key = `otp:limit:${sub}`;
    try {
      const isKeyExist = await redisClient.exists(key);
      if (!isKeyExist) {
        await redisClient.set(
          key,
          1,
          'PX',
          expiresInTimeUnitToMs(otpRateLimitSlidingWindow)
        );
        next();
      } else {
        const limitCount = await redisClient.incr(key);
        if (limitCount <= otpRateLimitMaxCount) {
          next();
        } else {
          res.status(429).json({
            success: false,
            message: 'Too Many Request,Try Again Later',
          });
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Otp Rate Limiter Middleware');
        next(error);
      }
    }
  },
  /**
   * Middleware to apply rate limiting and cooldown for the "resend OTP email" endpoint.
   *
   * Purpose:
   * - Prevents users from sending repeated OTP requests in quick succession.
   * - Mitigates spam, bot abuse, or accidental multiple requests that could overload the server.
   *
   * Behavior:
   * 1. Checks if a cooldown (`ttlKey`) already exists for the user:
   *    - If yes, blocks the request with a 400 response (`Try Again Later`).
   * 2. Checks if a count (`countKey`) exists:
   *    - If not, this is the first attempt:
   *      - Creates the cooldown key and initial count in Redis.
   *    - If yes, user has made previous attempts:
   *      - Increments the cooldown count.
   *      - Extends the cooldown duration **proportionally to the number of previous attempts** (linear backoff).
   *
   * Redis keys:
   * - `ttlKey` → Tracks the active cooldown period per user.
   * - `countKey` → Tracks the number of resend OTP attempts for the user.
   *
   * @param req - Express request object (must include `decoded.sub` for user identification)
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns JSON response with status 400 if cooldown is active, otherwise calls `next()`
   * @throws Forwards any Redis or unexpected errors to `next()`
   */
  resendOtpEmailCoolDown: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sub } = req.decoded;
    const ttlKey = `otp:resendOtpEmailCoolDown:${sub}`;
    const countKey = `otp:resendOtpEmailCoolDown:${sub}:count`;
    try {
      const isTtlKeyExist = await redisClient.exists(ttlKey);
      if (isTtlKeyExist) {
        res.status(400).json({
          success: false,
          message: `Try Again Later`,
        });
        return;
      }
      const isCountKeyExist = await redisClient.exists(countKey);
      if (!isCountKeyExist) {
        const initialExpireAt =
          1 * expiresInTimeUnitToMs(resendOtpEmailCoolDownWindow);
        const pipeline = redisClient.pipeline();
        pipeline.set(ttlKey, sub, 'PX', initialExpireAt);
        pipeline.set(countKey, 1, 'PX', 1 * 60 * 60 * 1000);
        await pipeline.exec();
        req.availableAt = Date.now() + initialExpireAt;
        next();
      } else {
        const currentCoolDownCount = Number(await redisClient.get(countKey));
        if (currentCoolDownCount >= maxOtpResendPerHour) {
          const countTtl = await redisClient.pttl(countKey);
          res.status(429).json({
            success: false,
            message: 'Too many attempts. Please try again later.',
            nextAvailableAt: Date.now() + countTtl,
          });
          return;
        }
        const pipeline = redisClient.pipeline();
        const coolDownCount = currentCoolDownCount + 1;
        const expireAt = Math.min(
          Math.pow(2, coolDownCount - 1) *
            expiresInTimeUnitToMs(resendOtpEmailCoolDownWindow),
          60 * 60 * 1000
        );
        pipeline.set(ttlKey, sub, 'PX', expireAt);
        pipeline.set(countKey, coolDownCount, 'KEEPTTL');
        await pipeline.exec();
        req.availableAt = Date.now() + expireAt;
        next();
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Otp Rate Limiter Middleware');
        next(new Error('Unknown Error In resendOtpEmailCoolDown middleware'));
      }
    }
  },
  checkActivationToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req?.cookies?.actv_token;
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Unauthorize Request',
          error: 'Refresh Token is missing',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(
        `blacklist:actv_token:${token}`
      );
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          message: 'Permission Denied',
          error: 'actv Token has been revoked',
        });
        return;
      }
      const decoded = verifyActivationToken(token);
      if (!decoded) {
        res.status(401).json({
          success: false,
          message: 'Permission Denied',
        });
        return;
      }
      req.decoded = decoded as TokenPayload;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Otp Rate Limiter Middleware');
        next(new Error('Unknown Error In resendOtpEmailCoolDown middleware'));
      }
    }
  },
  checkIpBlackList: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = getRealIP(req);
      const isBlacklisted = await redisClient.get(`blacklist:ip:${ip}`);
      if (isBlacklisted) {
        res.status(403).json({
          success: false,
          message:
            'Access denied: Your IP address has been temporarily blocked due to suspicious activity. Please try again later or contact support if you believe this is a mistake.',
        });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check IP Blacklist Middleware');
        next(new Error('Unknown Error In Check IP Blacklist middleware'));
      }
    }
  },
  checkLoginAttempts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, captchaToken } = req.body;
    try {
      const attempts = Number(
        await redisClient.get(`user:login:attempts:${email}`)
      );
      if (attempts >= 4 && !captchaToken) {
        res.status(402).json({
          success: false,
          message: 'Captcha verification failed, Captcha token required',
        });
        return;
      }
      if (attempts >= 4 && captchaToken) {
        const captchaRes = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
        );
        const data = captchaRes.data;
        if (!data.success) {
          res.status(402).json({
            success: false,
            message: 'Captcha verification failed',
          });
          return;
        }
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error(
          'Unknown Error Occurred In Check Login Attempts Middleware'
        );
        next(new Error('Unknown Error In Check Login Attempts middleware'));
      }
    }
  },
};

export default UserMiddlewares;
