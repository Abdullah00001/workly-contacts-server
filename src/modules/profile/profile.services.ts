import CloudinaryConfigs from '@/configs/cloudinary.configs';
import redisClient from '@/configs/redis.configs';
import {
  IGetProfilePayload,
  IProcessAvatarRemove,
  IProcessAvatarUpload,
  IProfilePayload,
  IProfileProjection,
} from '@/modules/profile/profile.interfaces';
import ProfileRepositories from '@/modules/profile/profile.repositories';
import { TPassword } from '@/modules/user/user.interfaces';
import CalculationUtils from '@/utils/calculation.utils';
import PasswordUtils from '@/utils/password.utils';
import { join } from 'path';

const { getProfile, updateProfile, changePassword, deleteAccount } =
  ProfileRepositories;
const { upload, destroy } = CloudinaryConfigs;
const { expiresInTimeUnitToMs } = CalculationUtils;
const { hashPassword } = PasswordUtils;

const ProfileServices = {
  processUpdateProfile: async (payload: IProfilePayload) => {
    try {
      const data = await updateProfile(payload);
      await redisClient.del(`me:${payload.user}`);
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
  processDeleteAccount: async (payload: IProfilePayload) => {
    try {
      await deleteAccount(payload);
      await Promise.all([
        redisClient.del(`me:${payload.user}`),
        redisClient.del(`contacts:${payload.user}`),
        redisClient.del(`favorites:${payload.user}`),
        redisClient.del(`trash:${payload.user}`),
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
        throw new Error('Unknown Error Occurred In Profile Avatar Services');
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
