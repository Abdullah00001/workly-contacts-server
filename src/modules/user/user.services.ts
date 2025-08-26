import UserRepositories from '@/modules/user/user.repositories';
import IUser, {
  IActivityPayload,
  IProcessFindUserReturn,
  IProcessRecoverAccountPayload,
  IResetPasswordServicePayload,
  IResetPasswordServiceReturnPayload,
  IUserPayload,
  TProcessVerifyUserArgs,
  TSession,
  TSignupSuccessEmailPayloadData,
} from '@/modules/user/user.interfaces';
import { generate } from 'otp-generator';
import redisClient from '@/configs/redis.configs';
import {
  accessTokenExpiresIn,
  AccountActivityMap,
  otpExpireAt,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
} from '@/const';
import JwtUtils from '@/utils/jwt.utils';
import { Types } from 'mongoose';
import { IRefreshTokenPayload } from '@/interfaces/jwtPayload.interfaces';
import CalculationUtils from '@/utils/calculation.utils';
import PasswordUtils from '@/utils/password.utils';
import EmailQueueJobs from '@/queue/jobs/email.jobs';
import { OtpUtilsSingleton } from '@/singletons';
import { v4 as uuidv4 } from 'uuid';
import DateUtils from '@/utils/date.utils';
import ActivityQueueJobs from '@/queue/jobs/activity.jobs';
import { ActivityType } from '@/modules/user/user.enums';

const { hashPassword } = PasswordUtils;
const {
  addSendAccountVerificationOtpEmailToQueue,
  addSendPasswordResetNotificationEmailToQueue,
  addSendAccountRecoverOtpEmailToQueue,
  addSendSignupSuccessNotificationEmailToQueue,
} = EmailQueueJobs;
const { signupSuccessActivitySavedInDb } = ActivityQueueJobs;
const { createNewUser, verifyUser, findUserByEmail, resetPassword } =
  UserRepositories;
const { expiresInTimeUnitToMs, calculateMilliseconds } = CalculationUtils;
const { calculateFutureDate } = DateUtils;
const { generateAccessToken, generateRefreshToken, generateRecoverToken } =
  JwtUtils;
const otpUtils = OtpUtilsSingleton();

const UserServices = {
  processSignup: async (payload: IUserPayload) => {
    try {
      const createdUser = await createNewUser(payload);
      const otp = generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      const hashOtp = otpUtils.hashOtp({ otp });
      await Promise.all([
        redisClient.set(
          `user:otp:${createdUser?._id}`,
          hashOtp,
          'PX',
          calculateMilliseconds(otpExpireAt, 'minute')
        ),
        addSendAccountVerificationOtpEmailToQueue({
          email: createdUser?.email,
          expirationTime: otpExpireAt,
          name: createdUser?.name,
          otp,
        }),
      ]);
      return createdUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Signup Service');
      }
    }
  },
  // processTokens: async (
  //   payload: IRefreshTokenPayload
  // ): Promise<IUserPayload> => {
  //   const { email, refreshToken } = payload;
  //   const user = await findUserByEmail(email);
  //   const newAccessToken = generateAccessToken({
  //     email: user?.email as string,
  //     isVerified: user?.isVerified as boolean,
  //     userId: user?._id as Types.ObjectId,
  //     name: user?.name as string,
  //   }) as string;

  //   const newRefreshToken = generateRefreshToken({
  //     email: user?.email as string,
  //     isVerified: user?.isVerified as boolean,
  //     userId: user?._id as Types.ObjectId,
  //     name: user?.name as string,
  //   }) as string;
  //   await redisClient.set(
  //     `blacklist:refreshToken:${user?._id}`,
  //     refreshToken,
  //     'PX',
  //     expiresInTimeUnitToMs(refreshTokenExpiresIn)
  //   );
  //   return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  // },
  processVerifyUser: async ({
    email,
    userId,
    browser,
    deviceType,
    location,
    os,
    ipAddress,
  }: TProcessVerifyUserArgs): Promise<IUserPayload> => {
    try {
      const user = await verifyUser({ email });
      await redisClient.del(`user:otp:${userId}`);
      const sid = uuidv4();
      const accessToken = generateAccessToken({
        sid,
        sub: user?._id as string,
      });
      const refreshToken = generateRefreshToken({
        sid,
        sub: user?._id as string,
      });
      const session: TSession = {
        browser,
        deviceType,
        location,
        os,
        createdAt: new Date().toISOString(),
        sessionId: sid,
        userId: user?._id as string,
        expiredAt: calculateFutureDate(refreshTokenExpiresIn),
        lastUsedAt: new Date().toISOString(),
      };
      const emailPayload: TSignupSuccessEmailPayloadData = {
        name: user?.name as string,
        email,
      };
      const activityPayload: IActivityPayload = {
        activityType: ActivityType.SIGNUP_SUCCESS,
        title: AccountActivityMap.SIGNUP_SUCCESS.title,
        description: AccountActivityMap.SIGNUP_SUCCESS.description,
        browser,
        device: deviceType,
        ipAddress,
        location,
        os,
        user: user?._id as Types.ObjectId,
      };
      await Promise.all([
        redisClient.set(
          `user:${user?._id}:sessions:${sid}`,
          JSON.stringify(session),
          'PX',
          expiresInTimeUnitToMs(refreshTokenExpiresIn)
        ),
        redisClient.sadd(`user:${user?._id}:sessions`, sid),
        signupSuccessActivitySavedInDb(activityPayload),
        addSendSignupSuccessNotificationEmailToQueue(emailPayload),
      ]);
      return { accessToken: accessToken!, refreshToken: refreshToken! };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Verify Service');
      }
    }
  },
  processResend: async ({ email, name, _id }: IUser) => {
    try {
      const otp = generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      await Promise.all([
        redisClient.set(
          `user:otp:${_id}`,
          otp,
          'PX',
          calculateMilliseconds(otpExpireAt, 'minute')
        ),
        addSendAccountVerificationOtpEmailToQueue({
          email: email as string,
          expirationTime: otpExpireAt,
          name: name as string,
          otp,
        }),
      ]);

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Resend Service');
      }
    }
  },
  // processLogin: (payload: IUser): IUserPayload => {
  //   const { email, isVerified, id, name } = payload;
  //   const accessToken = generateAccessToken({
  //     email,
  //     isVerified,
  //     userId: id,
  //     name,
  //   });
  //   const refreshToken = generateRefreshToken({
  //     email,
  //     isVerified,
  //     userId: id,
  //     name,
  //   });

  //   return {
  //     accessToken: accessToken!,
  //     refreshToken: refreshToken!,
  //   };
  // },
  // processLogout: async ({
  //   accessToken,
  //   refreshToken,
  //   userId,
  // }: IUserPayload) => {
  //   try {
  //     await redisClient.set(
  //       `blacklist:refreshToken:${userId}`,
  //       refreshToken!,
  //       'PX',
  //       expiresInTimeUnitToMs(refreshTokenExpiresIn)
  //     );
  //     await redisClient.set(
  //       `blacklist:accessToken:${userId}`,
  //       accessToken!,
  //       'PX',
  //       expiresInTimeUnitToMs(accessTokenExpiresIn)
  //     );
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error('Unknown Error Occurred In Process Logout Service');
  //     }
  //   }
  // },
  // processFindUser: ({
  //   _id,
  //   email,
  //   isVerified,
  //   name,
  //   avatar,
  // }: IUser): IProcessFindUserReturn => {
  //   try {
  //     const r_stp1 = generateRecoverToken({
  //       userId: _id as Types.ObjectId,
  //       email,
  //       isVerified,
  //       name,
  //       avatar,
  //     });
  //     return { r_stp1: r_stp1 as string };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error('Unknown Error Occurred In Process Find User Service');
  //     }
  //   }
  // },
  // processSentRecoverAccountOtp: async ({
  //   email,
  //   name,
  //   isVerified,
  //   userId,
  //   avatar,
  //   r_stp1,
  // }: IProcessRecoverAccountPayload): Promise<IProcessFindUserReturn> => {
  //   try {
  //     const otp = generate(6, {
  //       digits: true,
  //       lowerCaseAlphabets: false,
  //       specialChars: false,
  //       upperCaseAlphabets: false,
  //     });
  //     await Promise.all([
  //       await redisClient.set(
  //         `blacklist:recover:r_stp1:${userId}`,
  //         r_stp1!,
  //         'PX',
  //         expiresInTimeUnitToMs(recoverSessionExpiresIn)
  //       ),
  //       redisClient.set(
  //         `user:recover:otp:${userId}`,
  //         otp,
  //         'PX',
  //         calculateMilliseconds(otpExpireAt, 'minute')
  //       ),
  //       addSendAccountRecoverOtpEmailToQueue({
  //         email,
  //         expirationTime: otpExpireAt,
  //         name,
  //         otp,
  //       }),
  //     ]);
  //     const r_stp2 = generateRecoverToken({
  //       userId,
  //       email,
  //       isVerified: isVerified!,
  //       name,
  //       avatar,
  //     });
  //     return { r_stp2: r_stp2 as string };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error('Unknown Error Occurred In Process Find User Service');
  //     }
  //   }
  // },
  // processVerifyOtp: async ({
  //   email,
  //   isVerified,
  //   name,
  //   r_stp2,
  //   userId,
  //   avatar,
  // }: IProcessRecoverAccountPayload): Promise<IProcessFindUserReturn> => {
  //   try {
  //     await redisClient.del(`user:recover:otp:${userId}`);
  //     await redisClient.set(
  //       `blacklist:recover:r_stp2:${userId}`,
  //       r_stp2!,
  //       'PX',
  //       expiresInTimeUnitToMs(recoverSessionExpiresIn)
  //     );
  //     const r_stp3 = generateRecoverToken({
  //       userId,
  //       email,
  //       isVerified: isVerified!,
  //       name,
  //       avatar,
  //     });
  //     return { r_stp3: r_stp3 as string };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error('Unknown Error Occurred In Process Verify Otp Service');
  //     }
  //   }
  // },
  // processReSentRecoverAccountOtp: async ({
  //   email,
  //   name,
  //   userId,
  // }: IProcessRecoverAccountPayload) => {
  //   try {
  //     const otp = generate(6, {
  //       digits: true,
  //       lowerCaseAlphabets: false,
  //       specialChars: false,
  //       upperCaseAlphabets: false,
  //     });
  //     await Promise.all([
  //       addSendAccountRecoverOtpEmailToQueue({
  //         email,
  //         expirationTime: otpExpireAt,
  //         name,
  //         otp,
  //       }),
  //       redisClient.set(
  //         `user:recover:otp:${userId}`,
  //         otp,
  //         'PX',
  //         calculateMilliseconds(otpExpireAt, 'minute')
  //       ),
  //     ]);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error('Unknown Error Occurred In Process Find User Service');
  //     }
  //   }
  // },
  // processResetPassword: async ({
  //   device,
  //   email,
  //   ipAddress,
  //   location,
  //   name,
  //   r_stp3,
  //   userId,
  //   password,
  //   isVerified,
  // }: IResetPasswordServicePayload): Promise<IResetPasswordServiceReturnPayload> => {
  //   try {
  //     const hashed = (await hashPassword(password.secret)) as string;
  //     const newAccessToken = generateAccessToken({
  //       email,
  //       isVerified,
  //       userId,
  //       name,
  //     }) as string;

  //     const newRefreshToken = generateRefreshToken({
  //       email,
  //       isVerified,
  //       userId,
  //       name,
  //     }) as string;
  //     await Promise.all([
  //       resetPassword({ userId, password: { ...password, secret: hashed } }),
  //       redisClient.set(
  //         `blacklist:recover:r_stp2:${userId}`,
  //         r_stp3,
  //         'PX',
  //         expiresInTimeUnitToMs(recoverSessionExpiresIn)
  //       ),
  //       addSendPasswordResetNotificationEmailToQueue({
  //         device,
  //         email,
  //         ipAddress,
  //         location,
  //         name,
  //       }),
  //     ]);
  //     return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error(
  //         'Unknown Error Occurred In Process Reset Password Service'
  //       );
  //     }
  //   }
  // },
  // processOAuthCallback: ({
  //   email,
  //   name,
  //   isVerified,
  //   _id,
  // }: IUser): IUserPayload => {
  //   try {
  //     const accessToken = generateAccessToken({
  //       email,
  //       isVerified,
  //       userId: _id as Types.ObjectId,
  //       name,
  //     });
  //     const refreshToken = generateRefreshToken({
  //       email,
  //       isVerified,
  //       userId: _id as Types.ObjectId,
  //       name,
  //     });

  //     return {
  //       accessToken: accessToken!,
  //       refreshToken: refreshToken!,
  //     };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error(
  //         'Unknown Error Occurred In Process OAuth Callback Service'
  //       );
  //     }
  //   }
  // },
};

export default UserServices;
