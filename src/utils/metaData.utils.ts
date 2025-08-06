import { getLocationFromIP } from '@/const';
import {
  IGeoLocation,
  IGetClientMetaData,
} from '@/modules/user/user.interfaces';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

const ExtractMetaData = {
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
  getLocation: async (ipAddress: string): Promise<IGeoLocation> => {
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
      const location = await ExtractMetaData.getLocation(ipAddress);
      const { browser, device, os } = UAParser(req.useragent?.source);
      return { browser, device, os, location, ip: ipAddress };
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error('Unknown Error Occurred In Extract Meta Data');
    }
  },
};

export default ExtractMetaData;
