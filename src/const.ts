import { ActivityType } from '@/modules/user/user.enums';
import axios from 'axios';

export const corsWhiteList = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://amar-contacts.onrender.com',
  'https://amar-contacts-staging-client.onrender.com',
  'https://amar-contacts.vercel.app',
  'https://amar-contacts-staging-client.vercel.app',
  'https://amar-contacts-git-development-abdullah00001s-projects.vercel.app',
  'http://10.0.0.103:5173',
];
export const accessTokenExpiresIn = '1d';
export const refreshTokenExpiresIn = '7d';
export const recoverSessionExpiresIn = '1d';
export const serverCacheExpiredIn = '5m';
export const otpExpireAt = 4;
export const saltRound = 10;
export const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
export const baseUrl = {
  v1: '/api/v1',
};

export const getLocationFromIP = async (ip: string) => {
  try {
    // Using ip-api.com (free tier)
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};

export const dashboardUrl = 'http://amar-contacts.vercel.app';
export const profileUrl = 'http://amar-contacts.vercel.app/me';
export const supportEmail = 'abdullahbinomarchowdhury02@gmail.com';

export const AccountActivityMap: Record<
  ActivityType,
  { title: string; description: string }
> = {
  [ActivityType.LOGIN_SUCCESS]: {
    title: 'Logged in Successfully',
    description:
      'Your account was accessed using the correct credentials. If you did not perform this login, please review your account activity and change your password immediately.',
  },

  [ActivityType.LOGIN_FAILED]: {
    title: 'Failed Login Attempt',
    description:
      'Someone attempted to log in to your account with incorrect credentials. If this was not you, we recommend updating your password and enabling extra security measures.',
  },

  [ActivityType.SIGNUP_SUCCESS]: {
    title: 'Account Was Created',
    description:
      'Your Amar Contacts account was successfully registered.',
  },

  [ActivityType.PASSWORD_RESET]: {
    title: 'Password Was Changed',
    description:
      'Your account password was changed successfully. If you did not perform this action, please secure your account by resetting your password and reviewing recent activity.',
  },
  [ActivityType.ACCOUNT_LOCKED]:{
    title:'',
    description:''
  },
  [ActivityType.ACCOUNT_ACTIVE]:{
    title:'',
    description:''
  }
};
