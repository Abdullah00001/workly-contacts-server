import { getLocationFromIP } from '@/const';
import {
  IGeoLocation,
  IGetClientMetaData,
} from '@/modules/user/user.interfaces';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

const { getRealIP } = UserMiddlewares;

const ExtractMetaData = {
  getLocation: async (ipAddress: string): Promise<IGeoLocation> => {
    try {
      return await getLocationFromIP(ipAddress);
    } catch (error) {
      throw error;
    }
  },
  getClientMetaData: async (req: Request): Promise<IGetClientMetaData> => {
    try {
      const ipAddress = getRealIP(req);
      const location = await ExtractMetaData.getLocation(ipAddress);
      const { browser, device, os } = UAParser(req.useragent?.source);
      return { browser, device, os, location, ip: ipAddress };
    } catch (error) {
      throw error;
    }
  },
};

export default ExtractMetaData;
