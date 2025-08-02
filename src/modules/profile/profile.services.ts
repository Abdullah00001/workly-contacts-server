import redisClient from '@/configs/redis.configs';
import { serverCacheExpiredIn } from '@/const';
import { IProfilePayload } from '@/modules/profile/profile.interfaces';
import ProfileRepositories from '@/modules/profile/profile.repositories';
import { TPassword } from '@/modules/user/user.interfaces';
import CalculationUtils from '@/utils/calculation.utils';
import PasswordUtils from '@/utils/password.utils';

const { getProfile, updateProfile, changePassword, deleteAccount } =
  ProfileRepositories;
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
  processGetProfile: async (payload: IProfilePayload) => {
    try {
      const cacheData = await redisClient.get(`me:${payload.user}`);
      if (!cacheData) {
        const data = await getProfile(payload);
        await redisClient.set(
          `me:${payload.user}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs(serverCacheExpiredIn)
        );
        return data;
      } else {
        return JSON.parse(cacheData);
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
};

export default ProfileServices;
