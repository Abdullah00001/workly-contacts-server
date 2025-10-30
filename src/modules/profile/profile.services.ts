import CloudinaryConfigs from '@/configs/cloudinary.configs';
import redisClient from '@/configs/redis.configs';
import {
  accessTokenExpiresIn,
  AccountActivityMap,
  refreshTokenExpiresIn,
} from '@/const';
import {
  IGetProfilePayload,
  IProcessAvatarChange,
  IProcessAvatarRemove,
  IProcessAvatarUpload,
  IProfilePayload,
  IProfileProjection,
  TAccountDeletionScheduleEmailPayload,
  TProcessDeleteAccount,
} from '@/modules/profile/profile.interfaces';
import ProfileRepositories from '@/modules/profile/profile.repositories';
import { ActivityType } from '@/modules/user/user.enums';
import { IActivityPayload, TPassword } from '@/modules/user/user.interfaces';
import AccountDeleteQueueJobs from '@/queue/jobs/accountDelete.jobs';
import ActivityQueueJobs from '@/queue/jobs/activity.jobs';
import EmailQueueJobs from '@/queue/jobs/email.jobs';
import CalculationUtils from '@/utils/calculation.utils';
import DateUtils from '@/utils/date.utils';
import PasswordUtils from '@/utils/password.utils';
import { join } from 'path';

const { calculateFutureDate, formatDateTime } = DateUtils;
const { getProfile, updateProfile, changePassword, deleteAccount } =
  ProfileRepositories;
const { expiresInTimeUnitToMs, calculateMilliseconds } = CalculationUtils;
const { upload, destroy } = CloudinaryConfigs;
const { hashPassword } = PasswordUtils;
const { scheduleAccountDeletion } = AccountDeleteQueueJobs;
const { scheduleAccountDeletionActivitySavedInDb } = ActivityQueueJobs;
const { addAccountScheduleDeletionNotificationToQueue } = EmailQueueJobs;

const ProfileServices = {
  processUpdateProfile: async (payload: IProfilePayload) => {
    try {
      const data = await updateProfile(payload);
      // await redisClient.del(`me:${payload.user}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Update Profile Service');
      }
    }
  },
  processGetProfile: async ({ queryFieldList, user }: IGetProfilePayload) => {
    try {
      if (queryFieldList && queryFieldList.length > 0) {
        const projection: IProfileProjection = { _id: 0 };
        queryFieldList.forEach((fieldName) => {
          if (fieldName === 'location') {
            projection.location = '$profile.location';
          } else if (fieldName === 'dateOfBirth') {
            projection.dateOfBirth = '$profile.dateOfBirth';
          } else if (fieldName === 'gender') {
            projection.dateOfBirth = '$profile.gender';
          } else if (fieldName === 'name') {
            projection.name = 1;
          } else if (fieldName === 'avatar') {
            projection.avatar = 1;
          } else if (fieldName === 'email') {
            projection.email = 1;
          } else if (fieldName === 'phone') {
            projection.phone = 1;
          }
        });
        return await getProfile({ user, query: projection });
      } else {
        return await getProfile({ user });
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Profile Service');
      }
    }
  },
  processChangePassword: async ({ user, password }: IProfilePayload) => {
    try {
      const hash = (await hashPassword(password?.secret as string)) as string;
      await changePassword({
        user,
        password: { ...password, secret: hash } as TPassword,
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Change Password Service');
      }
    }
  },
  processDeleteAccount: async ({
    accessToken,
    browser,
    deviceType,
    ipAddress,
    location,
    os,
    refreshToken,
    user,
    sid,
  }: TProcessDeleteAccount) => {
    try {
      const pipeline = redisClient.pipeline();
      const activityPayload: IActivityPayload = {
        activityType: ActivityType.ACCOUNT_DELETE_SCHEDULE,
        title: AccountActivityMap.DELETION_SCHEDULED.title,
        description: AccountActivityMap.DELETION_SCHEDULED.description,
        browser,
        device: deviceType,
        ipAddress,
        location,
        os,
        user,
      };
      const result = await deleteAccount({ userId: user });
      const deleteAt = calculateFutureDate('7d');
      const emailPayload: TAccountDeletionScheduleEmailPayload = {
        email: result?.email as string,
        name: result?.name as string,
        scheduleAt: formatDateTime(new Date().toISOString()),
        deleteAt: formatDateTime(deleteAt),
      };
      pipeline.set(
        `blacklist:jwt:${accessToken}`,
        accessToken!,
        'PX',
        expiresInTimeUnitToMs(accessTokenExpiresIn)
      );
      pipeline.set(
        `blacklist:jwt:${refreshToken}`,
        refreshToken!,
        'PX',
        expiresInTimeUnitToMs(refreshTokenExpiresIn)
      );
      pipeline.set(
        `blacklist:sessions:${sid}`,
        sid,
        'PX',
        expiresInTimeUnitToMs(refreshTokenExpiresIn)
      );
      const sessions = await redisClient.smembers(`user:${user}:sessions`);
      pipeline.del(`user:${user}:sessions`);
      sessions.forEach((sid) => {
        pipeline.del(`user:${user}:sessions:${sid}`);
      });
      await Promise.all([
        pipeline.exec(),
        scheduleAccountDeletion({
          userId: user,
          scheduleAt: new Date().toISOString(),
          deleteAt,
        }),
        scheduleAccountDeletionActivitySavedInDb(activityPayload),
        addAccountScheduleDeletionNotificationToQueue(emailPayload),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Delete Account Services');
      }
    }
  },
  processAvatarUpload: async ({ fileName, user }: IProcessAvatarUpload) => {
    const avatarFilePath = join(__dirname, '../../../public/temp', fileName);
    try {
      const uploadResponse = await upload(avatarFilePath);
      if (!uploadResponse) throw new Error('Avatar Upload Failed');
      await updateProfile({ avatar: uploadResponse, user });
      return uploadResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Profile Avatar Upload Services'
        );
      }
    }
  },
  processAvatarChange: async ({
    fileName,
    user,
    publicId,
  }: IProcessAvatarChange) => {
    const avatarFilePath = join(__dirname, '../../../public/temp', fileName);
    try {
      const uploadResponse = await upload(avatarFilePath);
      if (!uploadResponse) throw new Error('Avatar Change Failed');
      await destroy(publicId);
      await updateProfile({ avatar: uploadResponse, user });
      return uploadResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Profile Avatar Change Services'
        );
      }
    }
  },
  processAvatarRemove: async ({ publicId, user }: IProcessAvatarRemove) => {
    try {
      await destroy(publicId);
      await updateProfile({ avatar: { publicId: null, url: null }, user });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Profile Avatar Services');
      }
    }
  },
};

export default ProfileServices;
