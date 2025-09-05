import { ActivityType } from '@/modules/user/user.enums';
import axios from 'axios';

export const corsWhiteList = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://amar-contacts.onrender.com',
  'https://amar-contacts-staging-client.onrender.com',
  'https://contacts.workly.ink',
  'http://10.0.0.103:5173',
];
export const accessTokenExpiresIn = '1m';
export const refreshTokenExpiresIn = '7d';
export const recoverSessionExpiresIn = '1d';
export const activationTokenExpiresIn = '1d';
export const changePasswordPageTokenExpiresIn = '15m';
export const serverCacheExpiredIn = '5m';
export const otpRateLimitMaxCount = 15;
export const otpRateLimitSlidingWindow = '1m';
export const resendOtpEmailCoolDownWindow = '2m';
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

export const dashboardUrl = 'https://contacts.workly.ink/';
export const profileUrl = 'https://contacts.workly.ink/';
export const supportEmail = 'amarcontacts79@gmail.com';

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
    description: 'Your Workly Contacts account was successfully registered.',
  },

  [ActivityType.PASSWORD_RESET]: {
    title: 'Password Was Changed',
    description:
      'Your account password was changed successfully. If you did not perform this action, please secure your account by resetting your password and reviewing recent activity.',
  },
  [ActivityType.ACCOUNT_LOCKED]: {
    title: 'Account Locked',
    description:
      'Your account has been temporarily locked due to multiple unsuccessful login attempts. Please verify your identity or contact support to regain access.',
  },
  [ActivityType.ACCOUNT_ACTIVE]: {
    title: 'Account Activated',
    description:
      'Your account has been successfully activated and is now ready for use. If you did not initiate this action, please contact support immediately.',
  },
};
