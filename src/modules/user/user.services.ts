import UserRepositories from '@/modules/user/user.repositories';
import {
  IActivityPayload,
  IProcessFindUserReturn,
  IProcessRecoverAccountPayload,
  IUserPayload,
  TAccountUnlockedEmailPayload,
  TLoginSuccessEmailPayload,
  TProcessChangePasswordAndAccountActivation,
  TProcessLoginPayload,
  TProcessOAuthCallBackPayload,
  TProcessVerifyUserArgs,
  TSession,
  TSignupSuccessEmailPayloadData,
  TProcessRefreshToken,
  TProcessLogout,
  TProcessCheckResendStatus,
  TProcessRetrieveSessionsForClearDevice,
  TProcessClearDeviceAndLoginPayload,
  TProcessFindUser,
  TResetPasswordServicePayload,
  IResetPasswordSendEmailPayload,
  SecurityOverviewData,
  TProcessActiveSessions,
  TProcessSessionsRemove,
} from '@/modules/user/user.interfaces';
import { generate } from 'otp-generator';
import redisClient from '@/configs/redis.configs';
import {
  accessTokenExpiresIn,
  AccountActivityMap,
  maxOtpResendPerHour,
  otpExpireAt,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
  refreshTokenExpiresInWithoutRememberMe,
} from '@/const';
import JwtUtils from '@/utils/jwt.utils';
import mongoose, { Types } from 'mongoose';
import CalculationUtils from '@/utils/calculation.utils';
import PasswordUtils from '@/utils/password.utils';
import EmailQueueJobs from '@/queue/jobs/email.jobs';
import { OtpUtilsSingleton } from '@/singletons';
import { v4 as uuidv4 } from 'uuid';
import DateUtils from '@/utils/date.utils';
import ActivityQueueJobs from '@/queue/jobs/activity.jobs';
import { ActivityType, AuthType } from '@/modules/user/user.enums';
import { RecoverUserInfoDTO } from '@/modules/user/user.dto';

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
  passwordResetActivitySavedInDb,
} = ActivityQueueJobs;
const {
  createNewUser,
  verifyUser,
  resetPassword,
  findUserById,
  changePasswordAndAccountActivation,
  retrieveSecurityOverviewData,
  recentActivityDataRetrieve,
  retrieveActivity,
  retrieveActivityDetails,
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
  processCheckResendStatus: async ({ userId }: TProcessCheckResendStatus) => {
    const ttlKey = `otp:resendOtpEmailCoolDown:${userId}`;
    const countKey = `otp:resendOtpEmailCoolDown:${userId}:count`;
    try {
      const currentCoolDownCount = Number(await redisClient.get(countKey));
      if (currentCoolDownCount >= maxOtpResendPerHour) {
        const countTtl = await redisClient.pttl(countKey);
        if (countTtl > 0) return { availableAt: Date.now() + countTtl };
      }
      const countTtl = await redisClient.pttl(ttlKey);
      if (countTtl > 0) return { availableAt: Date.now() + countTtl };
      return { availableAt: Date.now() };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Check Resend Status Service'
        );
      }
    }
  },
  processRefreshToken: async (payload: TProcessRefreshToken) => {
    try {
      const { sid, userId } = payload;
      const accessToken = generateAccessToken({
        sid,
        sub: userId as string,
      });
      const session = await redisClient.get(`user:${userId}:sessions:${sid}`);
      const parsedSession: TSession = JSON.parse(session as string);
      const updatedSession: TSession = {
        ...parsedSession,
        lastUsedAt: new Date().toISOString(),
      };
      await redisClient.set(
        `user:${userId}:sessions:${sid}`,
        JSON.stringify(updatedSession),
        'KEEPTTL'
      );
      return { accessToken };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Refresh Token Service'
        );
      }
    }
  },
  processRetrieveSessionsForClearDevice: async ({
    userId,
  }: TProcessRetrieveSessionsForClearDevice): Promise<TSession[]> => {
    try {
      const sessionIds = await redisClient.smembers(`user:${userId}:sessions`);
      const sessions: TSession[] = await Promise.all(
        sessionIds.map(async (sid) => {
          const session: string = (await redisClient.get(
            `user:${userId}:sessions:${sid}`
          )) as string;
          return JSON.parse(session) as TSession;
        })
      );
      return sessions;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Retrieve Sessions For Clear Device Service'
        );
      }
    }
  },
  processClearDeviceAndLogin: async ({
    browser,
    deviceType,
    devices,
    ipAddress,
    location,
    os,
    rememberMe,
    user,
    provider,
  }: TProcessClearDeviceAndLoginPayload) => {
    try {
      const { email, name, _id } = await findUserById(user);
      const sid = uuidv4();
      const accessToken = generateAccessToken({
        sid,
        sub: _id as string,
      });
      const refreshToken = generateRefreshToken({
        sid,
        sub: _id as string,
        rememberMe,
        provider,
      });
      const session: TSession = {
        browser,
        deviceType,
        location,
        os,
        createdAt: new Date().toISOString(),
        sessionId: sid,
        userId: _id as string,
        expiredAt:
          rememberMe || provider === AuthType.GOOGLE
            ? calculateFutureDate(refreshTokenExpiresIn)
            : calculateFutureDate(refreshTokenExpiresInWithoutRememberMe),
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
      devices.forEach((sid) => {
        redisPipeLine.set(
          `blacklist:sessions:${sid}`,
          sid,
          'PX',
          expiresInTimeUnitToMs(refreshTokenExpiresIn)
        );
        redisPipeLine.srem(`user:${_id}:sessions`, sid as string);
        redisPipeLine.del(`user:${_id}:sessions:${sid}`);
      });
      const sessionExpireIn =
        rememberMe || provider === AuthType.GOOGLE
          ? refreshTokenExpiresIn
          : refreshTokenExpiresInWithoutRememberMe;
      redisPipeLine.set(
        `user:${_id}:sessions:${sid}`,
        JSON.stringify(session),
        'PX',
        expiresInTimeUnitToMs(sessionExpireIn)
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
        throw new Error(
          'Unknown Error Occurred In Process Clear Device And Login Service'
        );
      }
    }
  },
  processLogin: async ({
    user,
    browser,
    deviceType,
    ipAddress,
    location,
    os,
    rememberMe,
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
        rememberMe,
      });
      const session: TSession = {
        browser,
        deviceType,
        location,
        os,
        createdAt: new Date().toISOString(),
        sessionId: sid,
        userId: _id as string,
        expiredAt: rememberMe
          ? calculateFutureDate(refreshTokenExpiresIn)
          : calculateFutureDate(refreshTokenExpiresInWithoutRememberMe),
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
  /**
   * Service to handle user logout by revoking tokens and cleaning up sessions.
   *
   * Responsibilities:
   * - Blacklists the provided refresh token with its TTL.
   * - Blacklists the provided access token with its TTL.
   * - Marks the session ID (`sid`) as blacklisted with the refresh token TTL.
   * - Removes the session ID from the user's active session set.
   * - Deletes the specific session record from Redis.
   *
   * @param params - Object containing logout details
   * @param params.accessToken - The access token to revoke
   * @param params.refreshToken - The refresh token to revoke
   * @param params.sid - Session ID to blacklist and remove
   * @param params.userId - The user ID associated with the session
   * @throws Will throw an error if Redis operations fail
   */

  processLogout: async ({
    accessToken,
    refreshToken,
    sid,
    userId,
  }: TProcessLogout) => {
    try {
      const pipeline = redisClient.pipeline();
      if (refreshToken) {
        pipeline.set(
          `blacklist:jwt:${refreshToken}`,
          refreshToken!,
          'PX',
          expiresInTimeUnitToMs(refreshTokenExpiresIn)
        );
      }
      pipeline.set(
        `blacklist:jwt:${accessToken}`,
        accessToken!,
        'PX',
        expiresInTimeUnitToMs(accessTokenExpiresIn)
      );
      pipeline.set(
        `blacklist:sessions:${sid}`,
        sid,
        'PX',
        expiresInTimeUnitToMs(refreshTokenExpiresIn)
      );
      pipeline.srem(`user:${userId}:sessions`, sid as string);
      pipeline.del(`user:${userId}:sessions:${sid}`);
      await pipeline.exec();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Logout Service');
      }
    }
  },
  processFindUser: ({ userId }: TProcessFindUser): IProcessFindUserReturn => {
    try {
      const r_stp1 = generateRecoverToken({
        sub: userId,
      });
      return { r_stp1: r_stp1 as string };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find User Service');
      }
    }
  },
  processRecoverUserInfo: async (userId: string) => {
    try {
      const data = await findUserById(userId);
      return RecoverUserInfoDTO.fromEntity(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Retrieve User Info Service'
        );
      }
    }
  },
  processSentRecoverAccountOtp: async ({
    userId,
    r_stp1,
  }: IProcessRecoverAccountPayload): Promise<IProcessFindUserReturn> => {
    try {
      const { email, name } = await findUserById(userId);
      const otp = generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      await Promise.all([
        await redisClient.set(
          `blacklist:recover:r_stp1:${userId}`,
          r_stp1!,
          'PX',
          expiresInTimeUnitToMs(recoverSessionExpiresIn)
        ),
        redisClient.set(
          `user:recover:otp:${userId}`,
          otp,
          'PX',
          calculateMilliseconds(otpExpireAt, 'minute')
        ),
        addSendAccountRecoverOtpEmailToQueue({
          email,
          expirationTime: otpExpireAt,
          name,
          otp,
        }),
      ]);
      const r_stp2 = generateRecoverToken({
        sub: userId,
      });
      return { r_stp2: r_stp2 as string };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find User Service');
      }
    }
  },
  processVerifyOtp: async ({
    r_stp2,
    userId,
  }: IProcessRecoverAccountPayload): Promise<IProcessFindUserReturn> => {
    try {
      const redisPipeLine = redisClient.pipeline();
      redisPipeLine.del(`user:recover:otp:${userId}`);
      redisPipeLine.set(
        `blacklist:recover:r_stp2:${userId}`,
        r_stp2!,
        'PX',
        expiresInTimeUnitToMs(recoverSessionExpiresIn)
      );
      redisPipeLine.del(`otp:limit:${userId}`);
      redisPipeLine.del(`otp:resendOtpEmailCoolDown:${userId}`);
      redisPipeLine.del(`otp:resendOtpEmailCoolDown:${userId}:count`);
      const r_stp3 = generateRecoverToken({
        sub: userId,
      });
      await redisPipeLine.exec();
      return { r_stp3: r_stp3 as string };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Verify Otp Service');
      }
    }
  },
  processReSentRecoverAccountOtp: async ({
    userId,
  }: IProcessRecoverAccountPayload) => {
    try {
      const { name, email } = await findUserById(userId);
      const otp = generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      await Promise.all([
        addSendAccountRecoverOtpEmailToQueue({
          email,
          expirationTime: otpExpireAt,
          name,
          otp,
        }),
        redisClient.set(
          `user:recover:otp:${userId}`,
          otp,
          'PX',
          calculateMilliseconds(otpExpireAt, 'minute')
        ),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find User Service');
      }
    }
  },
  processResetPassword: async ({
    browser,
    deviceType,
    ipAddress,
    location,
    os,
    password,
    r_stp3,
    userId,
  }: TResetPasswordServicePayload) => {
    const id = new mongoose.Types.ObjectId(userId);
    try {
      const hashed = (await hashPassword(password)) as string;
      const newPassword = {
        secret: hashed,
        change_at: new Date().toISOString(),
      };
      const user = await resetPassword({
        userId: id,
        password: newPassword,
      });
      if (!user) throw new Error('No User Found');
      const { email, name } = user;
      const emailPayload: IResetPasswordSendEmailPayload = {
        name,
        email,
        device: deviceType,
        ipAddress,
        location,
      };
      const activityPayload: IActivityPayload = {
        activityType: ActivityType.PASSWORD_RESET,
        title: AccountActivityMap.PASSWORD_RESET.title,
        description: AccountActivityMap.PASSWORD_RESET.description,
        browser,
        device: deviceType,
        ipAddress,
        location,
        os,
        user: user?._id as Types.ObjectId,
      };
      await Promise.all([
        redisClient.set(
          `blacklist:recover:r_stp2:${userId}`,
          r_stp3,
          'PX',
          expiresInTimeUnitToMs(recoverSessionExpiresIn)
        ),
        addSendPasswordResetNotificationEmailToQueue(emailPayload),
        passwordResetActivitySavedInDb(activityPayload),
      ]);
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Reset Password Service'
        );
      }
    }
  },
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
      if (activity === ActivityType.SIGNUP_SUCCESS) {
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
      if (activity === ActivityType.LOGIN_SUCCESS) {
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
  processSecurityOverview: async (
    userId: string
  ): Promise<SecurityOverviewData> => {
    try {
      const data = await retrieveSecurityOverviewData(userId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Security Overview Service'
        );
      }
    }
  },
  processActiveSessions: async ({
    sid,
    sub,
  }: TProcessActiveSessions): Promise<TSession[]> => {
    try {
      const sessionIds = await redisClient.smembers(`user:${sub}:sessions`);
      const sessions: TSession[] = await Promise.all(
        sessionIds.map(async (id) => {
          if (id === sid) {
            const currentSessionString = await redisClient.get(
              `user:${sub}:sessions:${id}`
            );
            const currentSession = JSON.parse(currentSessionString as string);
            return { ...currentSession, currentSession: true };
          }
          const otherSessionString = await redisClient.get(
            `user:${sub}:sessions:${id}`
          );
          const otherSession = JSON.parse(otherSessionString as string);
          return { ...otherSession, currentSession: false };
        })
      );
      return sessions;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Active Sessions Service'
        );
      }
    }
  },
  processRecentActivityData: async (user: string) => {
    try {
      const data = await recentActivityDataRetrieve(user);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Recent Activity Data Service'
        );
      }
    }
  },
  processSessionRemove: async ({
    sid,
    sub,
    sessionId,
  }: TProcessSessionsRemove) => {
    try {
      const redisPipeLine = redisClient.pipeline();
      redisPipeLine.set(
        `blacklist:sessions:${sessionId}`,
        sessionId,
        'PX',
        expiresInTimeUnitToMs(refreshTokenExpiresIn)
      );
      redisPipeLine.srem(`user:${sub}:sessions`, sessionId as string);
      redisPipeLine.del(`user:${sub}:sessions:${sessionId}`);
      await redisPipeLine.exec();
      const currentActiveSids = await redisClient.smembers(
        `user:${sub}:sessions`
      );
      const sessions: TSession[] = await Promise.all(
        currentActiveSids.map(async (id) => {
          if (id === sid) {
            const currentSessionString = await redisClient.get(
              `user:${sub}:sessions:${id}`
            );
            const currentSession = JSON.parse(currentSessionString as string);
            return { ...currentSession, currentSession: true };
          }
          const otherSessionString = await redisClient.get(
            `user:${sub}:sessions:${id}`
          );
          const otherSession = JSON.parse(otherSessionString as string);
          return { ...otherSession, currentSession: false };
        })
      );
      return sessions;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Remove Session Service'
        );
      }
    }
  },
  processRetrieveActivity: async (userId: string) => {
    try {
      const data = await retrieveActivity(userId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Retrieve Activity Service'
        );
      }
    }
  },
  processRetrieveActivityDetails: async (userId: string) => {
    try {
      const data = await retrieveActivityDetails(userId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Retrieve Activity Details Service'
        );
      }
    }
  },
};

export default UserServices;
