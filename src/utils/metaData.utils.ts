import redisClient from '@/configs/redis.configs';
import { getLocationFromIP } from '@/const';
import { env } from '@/env';
import { IAccountDeletionMetaData } from '@/modules/profile/profile.interfaces';
import {
  IGeoLocation,
  IGetClientMetaData,
  TGeoLocation,
} from '@/modules/user/user.interfaces';
import CalculationUtils from '@/utils/calculation.utils';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

const { calculateMilliseconds } = CalculationUtils;

const ExtractMetaData = {
  getRealIP: (req: Request): string => {
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const socketIp = req.socket.remoteAddress;
    if (env.NODE_ENV === 'development') {
      return '203.0.113.42';
    }
    if (forwarded) {
      return (forwarded as string).split(',')[0].trim();
    }

    if (realIp) {
      return realIp as string;
    }
    return socketIp || '';
  },
  getLocation: async (ipAddress: string): Promise<TGeoLocation> => {
    try {
      return await getLocationFromIP(ipAddress);
    } catch (error) {
      if (error instanceof Error) throw error;
      else
        throw new Error('Unknown Error Occurred In Retrieve Location From Ip');
    }
  },
  getClientMetaData: async (req: Request): Promise<IGetClientMetaData> => {
    try {
      const ipAddress = ExtractMetaData.getRealIP(req);
      const location = (await ExtractMetaData.getLocation(
        ipAddress
      )) as IGeoLocation;
      const { browser, device, os } = UAParser(req.useragent?.source);
      return { browser, device, os, location, ip: ipAddress };
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error('Unknown Error Occurred In Extract Meta Data');
    }
  },
  setAccountDeletionMetaData: async ({
    deleteAt,
    jobId,
    scheduleAt,
    userId,
  }: IAccountDeletionMetaData) => {
    await redisClient.set(
      `user:${userId}:delete-meta`,
      JSON.stringify({ deleteAt, jobId, scheduleAt }),
      'PX',
      calculateMilliseconds(7, 'days')
    );
    return;
  },
};

export default ExtractMetaData;
