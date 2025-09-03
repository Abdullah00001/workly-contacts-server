import UserRepositories from '@/modules/user/user.repositories';
import IUser, {
  IActivityPayload,
  IProcessFindUserReturn,
  IProcessRecoverAccountPayload,
  IResetPasswordServicePayload,
  IResetPasswordServiceReturnPayload,
  IUserPayload,
  TAccountUnlockedEmailPayload,
  TLoginSuccessEmailPayload,
  TProcessChangePasswordAndAccountActivation,
  TProcessLoginPayload,
  TProcessOAuthCallBackPayload,
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
import mongoose, { Types } from 'mongoose';
import { IRefreshTokenPayload } from '@/interfaces/jwtPayload.interfaces';
import CalculationUtils from '@/utils/calculation.utils';
import PasswordUtils from '@/utils/password.utils';
import EmailQueueJobs from '@/queue/jobs/email.jobs';
import { OtpUtilsSingleton } from '@/singletons';
import { v4 as uuidv4 } from 'uuid';
import DateUtils from '@/utils/date.utils';
import ActivityQueueJobs from '@/queue/jobs/activity.jobs';
import { AccountStatus, ActivityType } from '@/modules/user/user.enums';
import { TRequestUser } from '@/types/express';

const { hashPassword } = PasswordUtils;
const {
  addSendAccountVerificationOtpEmailToQueue,
  addSendPasswordResetNotificationEmailToQueue,
  addSendAccountRecoverOtpEmailToQueue,
  addSendSignupSuccessNotificationEmailToQueue,
  addLoginSuccessNotificationEmailToQueue,
  addAccountUnlockNotificationToQueue,
} = EmailQueueJobs;
const {
  signupSuccessActivitySavedInDb,
  loginSuccessActivitySavedInDb,
  accountUnlockActivitySavedInDb,
} = ActivityQueueJobs;
const {
  createNewUser,
  verifyUser,
  findUserByEmail,
  resetPassword,
  findUserById,
  updateUserAccountStatus,
  changePasswordAndAccountActivation,
} = UserRepositories;
const { expiresInTimeUnitToMs, calculateMilliseconds } = CalculationUtils;
const { calculateFutureDate, formatDateTime } = DateUtils;
const {
  generateAccessToken,
  generateRefreshToken,
  generateRecoverToken,
  generateActivationToken,
  generateChangePasswordPageToken,
} = JwtUtils;
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
      const activationToken = generateActivationToken({
        sub: createdUser?._id as string,
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
      return { createdUser, activationToken };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Signup Service');
      }
    }
  },
  processVerifyUser: async ({
    userId,
    browser,
    deviceType,
    location,
    os,
    ipAddress,
  }: TProcessVerifyUserArgs): Promise<IUserPayload> => {
    try {
      const user = await verifyUser({
        userId: new mongoose.Types.ObjectId(userId),
      });
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
        email: user?.email as string,
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
      const redisPipeLine = redisClient.pipeline();
      redisPipeLine.set(
        `user:${user?._id}:sessions:${sid}`,
        JSON.stringify(session),
        'PX',
        expiresInTimeUnitToMs(refreshTokenExpiresIn)
      );
      redisPipeLine.sadd(`user:${user?._id}:sessions`, sid);
      redisPipeLine.del(`user:otp:${userId}`);
      redisPipeLine.del(`otp:limit:${userId}`);
      redisPipeLine.del(`otp:resendOtpEmailCoolDown:${userId}`);
      redisPipeLine.del(`otp:resendOtpEmailCoolDown:${userId}:count`);
      await Promise.all([
        redisPipeLine.exec(),
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
  processResend: async (sub: string) => {
    try {
      const { email, name, _id } = await findUserById(sub);
      const otp = generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      const hashOtp = otpUtils.hashOtp({ otp });
      await Promise.all([
        redisClient.set(
          `user:otp:${_id}`,
          hashOtp,
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
  processTokens: async (
    payload: IRefreshTokenPayload
  ): Promise<IUserPayload> => {
    const { email, refreshToken } = payload;
    const user = await findUserByEmail(email);
    const newAccessToken = generateAccessToken({
      email: user?.email as string,
      isVerified: user?.isVerified as boolean,
      userId: user?._id as Types.ObjectId,
      name: user?.name as string,
    }) as string;

    const newRefreshToken = generateRefreshToken({
      email: user?.email as string,
      isVerified: user?.isVerified as boolean,
      userId: user?._id as Types.ObjectId,
      name: user?.name as string,
    }) as string;
    await redisClient.set(
      `blacklist:refreshToken:${user?._id}`,
      refreshToken,
      'PX',
      expiresInTimeUnitToMs(refreshTokenExpiresIn)
    );
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },
  processLogin: async ({
    user,
    browser,
    deviceType,
    ipAddress,
    location,
    os,
  }: TProcessLoginPayload): Promise<IUserPayload> => {
    try {
      const { _id, name, email } = user;
      const sid = uuidv4();
      const accessToken = generateAccessToken({
        sid,
        sub: _id as string,
      });
      const refreshToken = generateRefreshToken({
        sid,
        sub: _id as string,
      });
      const session: TSession = {
        browser,
        deviceType,
        location,
        os,
        createdAt: new Date().toISOString(),
        sessionId: sid,
        userId: _id as string,
        expiredAt: calculateFutureDate(refreshTokenExpiresIn),
        lastUsedAt: new Date().toISOString(),
      };
      const activityPayload: IActivityPayload = {
        activityType: ActivityType.LOGIN_SUCCESS,
        title: AccountActivityMap.LOGIN_SUCCESS.title,
        description: AccountActivityMap.LOGIN_SUCCESS.description,
        browser,
        device: deviceType,
        ipAddress,
        location,
        os,
        user: _id as Types.ObjectId,
      };
      const emailPayload: TLoginSuccessEmailPayload = {
        browser,
        device: deviceType,
        email,
        ip: ipAddress,
        location,
        name,
        os,
        time: formatDateTime(new Date().toISOString()),
      };
      const redisPipeLine = redisClient.pipeline();
      redisPipeLine.set(
        `user:${_id}:sessions:${sid}`,
        JSON.stringify(session),
        'PX',
        expiresInTimeUnitToMs(refreshTokenExpiresIn)
      );
      redisPipeLine.sadd(`user:${_id}:sessions`, sid);
      await Promise.all([
        redisPipeLine.exec(),
        loginSuccessActivitySavedInDb(activityPayload),
        addLoginSuccessNotificationEmailToQueue(emailPayload),
      ]);
      return {
        accessToken: accessToken!,
        refreshToken: refreshToken!,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Login Service');
      }
    }
  },
  processLogout: async ({
    accessToken,
    refreshToken,
    userId,
  }: IUserPayload) => {
    try {
      await redisClient.set(
        `blacklist:jwt:${refreshToken}`,
        refreshToken!,
        'PX',
        expiresInTimeUnitToMs(refreshTokenExpiresIn)
      );
      await redisClient.set(
        `blacklist:jwt:${accessToken}`,
        accessToken!,
        'PX',
        expiresInTimeUnitToMs(accessTokenExpiresIn)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Logout Service');
      }
    }
  },
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
  processOAuthCallback: async ({
    user,
    activity,
    browser,
    deviceType,
    ipAddress,
    location,
    os,
  }: TProcessOAuthCallBackPayload): Promise<IUserPayload> => {
    try {
      const { _id, name, email } = user;
      const sid = uuidv4();
      const accessToken = generateAccessToken({
        sid,
        sub: _id as string,
      });
      const refreshToken = generateRefreshToken({
        sid,
        sub: _id as string,
      });
      const session: TSession = {
        browser,
        deviceType,
        location,
        os,
        createdAt: new Date().toISOString(),
        sessionId: sid,
        userId: _id as string,
        expiredAt: calculateFutureDate(refreshTokenExpiresIn),
        lastUsedAt: new Date().toISOString(),
      };
      let activityPayload: IActivityPayload;
      if ((activity = ActivityType.SIGNUP_SUCCESS)) {
        activityPayload = {
          activityType: ActivityType.SIGNUP_SUCCESS,
          title: AccountActivityMap.SIGNUP_SUCCESS.title,
          description: AccountActivityMap.SIGNUP_SUCCESS.description,
          browser,
          device: deviceType,
          ipAddress,
          location,
          os,
          user: _id as Types.ObjectId,
        };
        const emailPayload: TSignupSuccessEmailPayloadData = {
          name,
          email,
        };
        const redisPipeLine = redisClient.pipeline();
        redisPipeLine.set(
          `user:${_id}:sessions:${sid}`,
          JSON.stringify(session),
          'PX',
          expiresInTimeUnitToMs(refreshTokenExpiresIn)
        );
        redisPipeLine.sadd(`user:${_id}:sessions`, sid);
        redisPipeLine.del(`user:otp:${_id}`);
        redisPipeLine.del(`otp:limit:${_id}`);
        redisPipeLine.del(`otp:resendOtpEmailCoolDown:${_id}`);
        redisPipeLine.del(`otp:resendOtpEmailCoolDown:${_id}:count`);
        await Promise.all([
          redisPipeLine.exec(),
          signupSuccessActivitySavedInDb(activityPayload),
          addSendSignupSuccessNotificationEmailToQueue(emailPayload),
        ]);
      }
      if ((activity = ActivityType.LOGIN_SUCCESS)) {
        activityPayload = {
          activityType: ActivityType.LOGIN_SUCCESS,
          title: AccountActivityMap.LOGIN_SUCCESS.title,
          description: AccountActivityMap.LOGIN_SUCCESS.description,
          browser,
          device: deviceType,
          ipAddress,
          location,
          os,
          user: _id as Types.ObjectId,
        };
        const emailPayload: TLoginSuccessEmailPayload = {
          browser,
          device: deviceType,
          email,
          ip: ipAddress,
          location,
          name,
          os,
          time: new Date().toISOString(),
        };
        const redisPipeLine = redisClient.pipeline();
        redisPipeLine.set(
          `user:${_id}:sessions:${sid}`,
          JSON.stringify(session),
          'PX',
          expiresInTimeUnitToMs(refreshTokenExpiresIn)
        );
        redisPipeLine.sadd(`user:${_id}:sessions`, sid);
        redisPipeLine.del(`user:otp:${_id}`);
        redisPipeLine.del(`otp:limit:${_id}`);
        redisPipeLine.del(`otp:resendOtpEmailCoolDown:${_id}`);
        redisPipeLine.del(`otp:resendOtpEmailCoolDown:${_id}:count`);
        await Promise.all([
          redisPipeLine.exec(),
          loginSuccessActivitySavedInDb(activityPayload),
          addLoginSuccessNotificationEmailToQueue(emailPayload),
        ]);
      }
      return {
        accessToken: accessToken!,
        refreshToken: refreshToken!,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process OAuth Callback Service'
        );
      }
    }
  },
  processAccountActivation: (userId: string) => {
    try {
      const token = generateChangePasswordPageToken({ sub: userId });
      return token;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Account Activation Service'
        );
      }
    }
  },
  processChangePasswordAndAccountActivation: async ({
    token,
    userId,
    uuid,
    password,
    browser,
    deviceType,
    ipAddress,
    location,
    os,
  }: TProcessChangePasswordAndAccountActivation) => {
    try {
      const id = new mongoose.Types.ObjectId(userId);
      const hashSecret = await hashPassword(password);
      const user = await changePasswordAndAccountActivation({
        userId: id,
        password: hashSecret as string,
      });
      const pipeline = redisClient.pipeline();
      pipeline.del(`user:activation:uuid:${uuid}`);
      pipeline.set(
        `blacklist:jwt:${token}`,
        token,
        'PX',
        expiresInTimeUnitToMs('15m')
      );
      const activityPayload = {
        activityType: ActivityType.ACCOUNT_ACTIVE,
        title: AccountActivityMap.ACCOUNT_ACTIVE.title,
        description: AccountActivityMap.ACCOUNT_ACTIVE.description,
        browser,
        device: deviceType,
        ipAddress,
        location,
        os,
        user: user?._id as Types.ObjectId,
      };
      const emailPayload: TAccountUnlockedEmailPayload = {
        email: user?.email as string,
        name: user?.name as string,
        time: formatDateTime(new Date().toISOString()),
      };
      await Promise.all([
        pipeline.exec(),
        addAccountUnlockNotificationToQueue(emailPayload),
        accountUnlockActivitySavedInDb(activityPayload),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Change Password And Account Activation Service'
        );
      }
    }
  },
};

export default UserServices;
