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
import { AccountStatus, ActivityType } from '@/modules/user/user.enums';
import { Types } from 'mongoose';
import {
  AccountActivityMap,
  baseUrl,
  otpRateLimitMaxCount,
  otpRateLimitSlidingWindow,
  resendOtpEmailCoolDownWindow,
} from '@/const';
import DateUtils from '@/utils/date.utils';
import { OtpUtilsSingleton } from '@/singletons';
import CalculationUtils from '@/utils/calculation.utils';
import CookieUtils from '@/utils/cookie.utils';
import axios from 'axios';
import { env } from '@/env';
import { v4 as uuidv4 } from 'uuid';

const { comparePassword } = PasswordUtils;
const { findUserByEmail, updateUserAccountStatus } = UserRepositories;
const {
  verifyAccessToken,
  verifyRefreshToken,
  verifyRecoverToken,
  verifyActivationToken,
} = JwtUtils;
const { sharedCookieOption } = CookieUtils;
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
        res.status(404).json({
          success: false,
          message: 'Invalid Credential,Check Your Email And Password',
        });
        return;
      }
      if (!isUserExist.isVerified) {
        res.status(400).json({ success: false, message: 'User Not Verified' });
        return;
      }
      req.user = { user: isUserExist };
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
      req.user = { user: isUserExist };
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
      const { isVerified } = req.user?.user as IUser;
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
      const { userId } = req.decoded;
      const storedOtp = await redisClient.get(`user:recover:otp:${userId}`);
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
      const { name, email, password, _id } = req.user?.user as IUser;
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
            activeLink: `${env.SERVER_BASE_URL}${baseUrl.v1}/${uuid}`,
          };
          const pipeline = redisClient.pipeline();
          await updateUserAccountStatus({
            userId: _id as Types.ObjectId,
            accountStatus: AccountStatus.LOCKED,
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
      const isBlacklisted = await redisClient.get(
        `blacklist:accessToken:${token}`
      );
      if (isBlacklisted) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
          error: 'Accesstoken has been revoked',
        });
        return;
      }
      const decoded = verifyAccessToken(token);
      if (!decoded) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
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
      const isBlacklisted = await redisClient.get(
        `blacklist:refreshToken:${token}`
      );
      if (isBlacklisted) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
          error: 'Refresh Token has been revoked',
        });
        return;
      }
      const decoded = verifyRefreshToken(token);
      if (!decoded) {
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
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
  resendOtpEmailCoolDown: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sub } = req?.decoded;
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
        next();
      } else {
        const pipeline = redisClient.pipeline();
        const currentCoolDownCount = Number(await redisClient.get(countKey));
        const coolDownCount = currentCoolDownCount + 1;
        const expireAt =
          coolDownCount * expiresInTimeUnitToMs(resendOtpEmailCoolDownWindow);
        pipeline.set(ttlKey, sub, 'PX', expireAt);
        pipeline.set(countKey, coolDownCount, 'KEEPTTL');
        await pipeline.exec();
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
        res.status(403).json({
          success: false,
          message: 'Permission Denied',
          error: 'actv Token has been revoked',
        });
        return;
      }
      const decoded = verifyActivationToken(token);
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
        res.status(400).json({
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
