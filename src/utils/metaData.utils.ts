import { getLocationFromIP } from '@/const';
import { env } from '@/env';
import {
  IGeoLocation,
  IGetClientMetaData,
  TGeoLocation,
} from '@/modules/user/user.interfaces';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

const ExtractMetaData = {
  getRealIP: (req: Request) => {
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
      if (env.NODE_ENV === 'development') {
        return { city: 'Dhaka', country: 'Bangladesh' };
      }
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
      if (env.NODE_ENV === 'development') {
        // Mock UAParser.IBrowser
        const mockBrowser: UAParser.IBrowser = {
          name: 'Chrome',
          version: '120.0.0.0',
          major: '120',
          is: (name: string) => name.toLowerCase() === 'chrome',
          withClientHints: async () => ({
            name: 'Chrome',
            version: '120.0.0.0',
            major: '120',
            is: (name: string) => name.toLowerCase() === 'chrome',
            withClientHints: async () => mockBrowser,
            withFeatureCheck: async () => mockBrowser,
          }),
          withFeatureCheck: async () => ({
            name: 'Chrome',
            version: '120.0.0.0',
            major: '120',
            is: (name: string) => name.toLowerCase() === 'chrome',
            withClientHints: async () => mockBrowser,
            withFeatureCheck: async () => mockBrowser,
          }),
        };

        // Mock UAParser.IOS
        const mockOs: UAParser.IOS = {
          name: 'Linux',
          version: '5.4',
          is: (name: string) => name.toLowerCase() === 'linux',
          withClientHints: async () => ({
            name: 'Linux',
            version: '5.4',
            is: (name: string) => name.toLowerCase() === 'linux',
            withClientHints: async () => mockOs,
            withFeatureCheck: async () => mockOs,
          }),
          withFeatureCheck: async () => ({
            name: 'Linux',
            version: '5.4',
            is: (name: string) => name.toLowerCase() === 'linux',
            withClientHints: async () => mockOs,
            withFeatureCheck: async () => mockOs,
          }),
        };

        // Mock UAParser.IDevice
        const mockDevice: UAParser.IDevice = {
          model: 'Unknown',
          type: 'mobile',
          vendor: 'Unknown',
          is: (type: string) => type.toLowerCase() === 'mobile',
          withClientHints: async () => ({
            model: 'Unknown',
            type: 'mobile',
            vendor: 'Unknown',
            is: (type: string) => type.toLowerCase() === 'mobile',
            withClientHints: async () => mockDevice,
            withFeatureCheck: async () => mockDevice,
          }),
          withFeatureCheck: async () => ({
            model: 'Unknown',
            type: 'mobile',
            vendor: 'Unknown',
            is: (type: string) => type.toLowerCase() === 'mobile',
            withClientHints: async () => mockDevice,
            withFeatureCheck: async () => mockDevice,
          }),
        };

        return {
          browser: mockBrowser,
          device: mockDevice,
          os: mockOs,
          location,
          ip: ipAddress,
        };
      }
      const { browser, device, os } = UAParser(req.useragent?.source);
      return { browser, device, os, location, ip: ipAddress };
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error('Unknown Error Occurred In Extract Meta Data');
    }
  },
};

export default ExtractMetaData;
