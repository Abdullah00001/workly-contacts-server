import logger from '@/configs/logger.configs';
import redisClient from '@/configs/redis.configs';
import UserRepositories from '@/modules/user/user.repositories';
import { NextFunction, Request, Response } from 'express';
import IUser from '@/modules/user/user.interfaces';
import PasswordUtils from '@/utils/password.utils';
import { TokenPayload } from '@/interfaces/jwtPayload.interfaces';
import JwtUtils from '@/utils/jwt.utils';

const { comparePassword } = PasswordUtils;
const { findUserByEmail } = UserRepositories;
const { verifyAccessToken, verifyRefreshToken, verifyRecoverToken } = JwtUtils;

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
        res.status(404).json({ status: 'error', message: 'User Not Found' });
        return;
      }
      if (!isUserExist.isVerified) {
        res.status(400).json({ status: 'error', message: 'User Not Verified' });
        return;
      }
      req.user = isUserExist;
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
        res.status(404).json({ status: 'error', message: 'User Not Found' });
        return;
      }
      req.user = isUserExist;
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
      const { isVerified } = req.user as IUser;
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
      const user = req?.user as IUser;
      const storedOtp = await redisClient.get(`user:otp:${user?._id}`);
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
      const { password } = req.user as IUser;
      if (!(await comparePassword(req?.body?.password, password.secret))) {
        res.status(400).json({ status: 'error', message: 'Invalid Password' });
        return;
      }
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
          status: 'error',
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
          status: 'error',
          message: 'Permission Denied',
          error: 'Accesstoken has been revoked',
        });
        return;
      }
      const decoded = verifyAccessToken(token);
      if (!decoded) {
        res.status(403).json({
          status: 'error',
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
          status: 'error',
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
          status: 'error',
          message: 'Permission Denied',
          error: 'Refresh Token has been revoked',
        });
        return;
      }
      const decoded = verifyRefreshToken(token);
      if (!decoded) {
        res.status(403).json({
          status: 'error',
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
          status: 'error',
          message: 'Unauthorize Request',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(`blacklist:r_stp1:${token}`);
      if (isBlacklisted) {
        res.status(403).json({
          status: 'error',
          message: 'Permission Denied',
        });
        return;
      }
      const decoded = verifyRecoverToken(token);
      if (!decoded) {
        res.status(403).json({
          status: 'error',
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
          status: 'error',
          message: 'Unauthorize Request',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(`blacklist:r_stp2:${token}`);
      if (isBlacklisted) {
        res.status(403).json({
          status: 'error',
          message: 'Permission Denied',
        });
        return;
      }
      const decoded = verifyRecoverToken(token);
      if (!decoded) {
        res.status(403).json({
          status: 'error',
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
          status: 'error',
          message: 'Unauthorize Request',
        });
        return;
      }
      const isBlacklisted = await redisClient.get(`blacklist:r_stp3:${token}`);
      if (isBlacklisted) {
        res.status(403).json({
          status: 'error',
          message: 'Permission Denied',
        });
        return;
      }
      const decoded = verifyRecoverToken(token);
      if (!decoded) {
        res.status(403).json({
          status: 'error',
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
  getRealIP: (req: Request) => {
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const socketIp = req.socket.remoteAddress;

    if (forwarded) {
      return (forwarded as string).split(',')[0].trim();
    }

    if (realIp) {
      return realIp as string;
    }
    return socketIp || '';
  },
};

export default UserMiddlewares;
