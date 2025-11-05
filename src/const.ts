import { ActivityType } from '@/modules/user/user.enums';
import axios from 'axios';

export const corsWhiteList = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://amar-contacts.onrender.com',
  'https://amar-contacts-staging-client.onrender.com',
  'https://workly.ink',
  'https://contacts.workly.ink',
  'http://10.0.0.103:3000',
];
export const accessTokenExpiresIn = '15m';
export const refreshTokenExpiresIn = '7d';
export const addPasswordPageTokenExpiresIn = '7d';
export const refreshTokenExpiresInWithoutRememberMe = '1d';
export const recoverSessionExpiresIn = '5m';
export const activationTokenExpiresIn = '1d';
export const changePasswordPageTokenExpiresIn = '15m';
export const serverCacheExpiredIn = '5m';
export const otpRateLimitMaxCount = 15;
export const otpRateLimitSlidingWindow = '1m';
export const resendOtpEmailCoolDownWindow = '2m';
export const maxOtpResendPerHour = 5;
export const otpExpireAt = 4;
export const saltRound = 10;
export const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
export const baseUrl = {
  v1: '/api/v1',
};
export const clearDevicePageTokenExpireIn = '60m';
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
export const profileUrl = 'https://contacts.workly.ink/accountscenter';
export const supportEmail = 'worklycontacts@gmail.com';

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
  [ActivityType.ACCOUNT_DELETE_SCHEDULE]: {
    title: 'Account Deletion Scheduled',
    description:
      'You requested to delete your account. Your account and all associated data are scheduled for permanent deletion after 7 days. If you log in before that time, the deletion will be automatically cancelled.',
  },
  [ActivityType.ACCOUNT_DELETE_SCHEDULE_CANCEL]: {
    title: 'Account Deletion Cancelled',
    description:
      'Your recent login activity has cancelled the previously scheduled account deletion. Your account is now active again. If you did not perform this login, please secure your account immediately.',
  },
};

export const allowedMimeTypes = [
  'text/csv',
  'application/vnd.ms-excel',
  'text/vcard',
  'text/x-vcard',
  'text/directory',
  'application/vcard+json',
];

export const MAX_IMPORT_FILE_SIZE = 2 * 1024 * 1024;

export const Countries = [
  { name: 'Afghanistan', code: '+93', iso: 'af' },
  { name: 'Albania', code: '+355', iso: 'al' },
  { name: 'Algeria', code: '+213', iso: 'dz' },
  { name: 'Andorra', code: '+376', iso: 'ad' },
  { name: 'Angola', code: '+244', iso: 'ao' },
  { name: 'Argentina', code: '+54', iso: 'ar' },
  { name: 'Armenia', code: '+374', iso: 'am' },
  { name: 'Australia', code: '+61', iso: 'au' },
  { name: 'Austria', code: '+43', iso: 'at' },
  { name: 'Azerbaijan', code: '+994', iso: 'az' },
  { name: 'Bahamas', code: '+1-242', iso: 'bs' },
  { name: 'Bahrain', code: '+973', iso: 'bh' },
  { name: 'Bangladesh', code: '+880', iso: 'bd' },
  { name: 'Barbados', code: '+1-246', iso: 'bb' },
  { name: 'Belarus', code: '+375', iso: 'by' },
  { name: 'Belgium', code: '+32', iso: 'be' },
  { name: 'Belize', code: '+501', iso: 'bz' },
  { name: 'Benin', code: '+229', iso: 'bj' },
  { name: 'Bhutan', code: '+975', iso: 'bt' },
  { name: 'Bolivia', code: '+591', iso: 'bo' },
  { name: 'Bosnia and Herzegovina', code: '+387', iso: 'ba' },
  { name: 'Botswana', code: '+267', iso: 'bw' },
  { name: 'Brazil', code: '+55', iso: 'br' },
  { name: 'Brunei', code: '+673', iso: 'bn' },
  { name: 'Bulgaria', code: '+359', iso: 'bg' },
  { name: 'Burkina Faso', code: '+226', iso: 'bf' },
  { name: 'Burundi', code: '+257', iso: 'bi' },
  { name: 'Cambodia', code: '+855', iso: 'kh' },
  { name: 'Cameroon', code: '+237', iso: 'cm' },
  { name: 'Canada', code: '+1', iso: 'ca' },
  { name: 'Chile', code: '+56', iso: 'cl' },
  { name: 'China', code: '+86', iso: 'cn' },
  { name: 'Colombia', code: '+57', iso: 'co' },
  { name: 'Comoros', code: '+269', iso: 'km' },
  { name: 'Congo (DRC)', code: '+243', iso: 'cd' },
  { name: 'Congo (Republic)', code: '+242', iso: 'cg' },
  { name: 'Costa Rica', code: '+506', iso: 'cr' },
  { name: 'Croatia', code: '+385', iso: 'hr' },
  { name: 'Cuba', code: '+53', iso: 'cu' },
  { name: 'Cyprus', code: '+357', iso: 'cy' },
  { name: 'Czech Republic', code: '+420', iso: 'cz' },
  { name: 'Denmark', code: '+45', iso: 'dk' },
  { name: 'Djibouti', code: '+253', iso: 'dj' },
  { name: 'Dominican Republic', code: '+1-809', iso: 'do' },
  { name: 'Ecuador', code: '+593', iso: 'ec' },
  { name: 'Egypt', code: '+20', iso: 'eg' },
  { name: 'El Salvador', code: '+503', iso: 'sv' },
  { name: 'Estonia', code: '+372', iso: 'ee' },
  { name: 'Ethiopia', code: '+251', iso: 'et' },
  { name: 'Fiji', code: '+679', iso: 'fj' },
  { name: 'Finland', code: '+358', iso: 'fi' },
  { name: 'France', code: '+33', iso: 'fr' },
  { name: 'Gabon', code: '+241', iso: 'ga' },
  { name: 'Gambia', code: '+220', iso: 'gm' },
  { name: 'Georgia', code: '+995', iso: 'ge' },
  { name: 'Germany', code: '+49', iso: 'de' },
  { name: 'Ghana', code: '+233', iso: 'gh' },
  { name: 'Greece', code: '+30', iso: 'gr' },
  { name: 'Guatemala', code: '+502', iso: 'gt' },
  { name: 'Haiti', code: '+509', iso: 'ht' },
  { name: 'Honduras', code: '+504', iso: 'hn' },
  { name: 'Hong Kong', code: '+852', iso: 'hk' },
  { name: 'Hungary', code: '+36', iso: 'hu' },
  { name: 'Iceland', code: '+354', iso: 'is' },
  { name: 'India', code: '+91', iso: 'in' },
  { name: 'Indonesia', code: '+62', iso: 'id' },
  { name: 'Iran', code: '+98', iso: 'ir' },
  { name: 'Iraq', code: '+964', iso: 'iq' },
  { name: 'Ireland', code: '+353', iso: 'ie' },
  { name: 'Israel', code: '+972', iso: 'il' },
  { name: 'Italy', code: '+39', iso: 'it' },
  { name: 'Jamaica', code: '+1-876', iso: 'jm' },
  { name: 'Japan', code: '+81', iso: 'jp' },
  { name: 'Jordan', code: '+962', iso: 'jo' },
  { name: 'Kazakhstan', code: '+7', iso: 'kz' },
  { name: 'Kenya', code: '+254', iso: 'ke' },
  { name: 'Kuwait', code: '+965', iso: 'kw' },
  { name: 'Kyrgyzstan', code: '+996', iso: 'kg' },
  { name: 'Laos', code: '+856', iso: 'la' },
  { name: 'Latvia', code: '+371', iso: 'lv' },
  { name: 'Lebanon', code: '+961', iso: 'lb' },
  { name: 'Lesotho', code: '+266', iso: 'ls' },
  { name: 'Liberia', code: '+231', iso: 'lr' },
  { name: 'Libya', code: '+218', iso: 'ly' },
  { name: 'Lithuania', code: '+370', iso: 'lt' },
  { name: 'Luxembourg', code: '+352', iso: 'lu' },
  { name: 'Macau', code: '+853', iso: 'mo' },
  { name: 'Madagascar', code: '+261', iso: 'mg' },
  { name: 'Malawi', code: '+265', iso: 'mw' },
  { name: 'Malaysia', code: '+60', iso: 'my' },
  { name: 'Maldives', code: '+960', iso: 'mv' },
  { name: 'Mali', code: '+223', iso: 'ml' },
  { name: 'Malta', code: '+356', iso: 'mt' },
  { name: 'Mauritania', code: '+222', iso: 'mr' },
  { name: 'Mauritius', code: '+230', iso: 'mu' },
  { name: 'Mexico', code: '+52', iso: 'mx' },
  { name: 'Moldova', code: '+373', iso: 'md' },
  { name: 'Monaco', code: '+377', iso: 'mc' },
  { name: 'Mongolia', code: '+976', iso: 'mn' },
  { name: 'Montenegro', code: '+382', iso: 'me' },
  { name: 'Morocco', code: '+212', iso: 'ma' },
  { name: 'Mozambique', code: '+258', iso: 'mz' },
  { name: 'Myanmar', code: '+95', iso: 'mm' },
  { name: 'Namibia', code: '+264', iso: 'na' },
  { name: 'Nepal', code: '+977', iso: 'np' },
  { name: 'Netherlands', code: '+31', iso: 'nl' },
  { name: 'New Zealand', code: '+64', iso: 'nz' },
  { name: 'Nicaragua', code: '+505', iso: 'ni' },
  { name: 'Niger', code: '+227', iso: 'ne' },
  { name: 'Nigeria', code: '+234', iso: 'ng' },
  { name: 'North Korea', code: '+850', iso: 'kp' },
  { name: 'Norway', code: '+47', iso: 'no' },
  { name: 'Oman', code: '+968', iso: 'om' },
  { name: 'Pakistan', code: '+92', iso: 'pk' },
  { name: 'Palestine', code: '+970', iso: 'ps' },
  { name: 'Panama', code: '+507', iso: 'pa' },
  { name: 'Papua New Guinea', code: '+675', iso: 'pg' },
  { name: 'Paraguay', code: '+595', iso: 'py' },
  { name: 'Peru', code: '+51', iso: 'pe' },
  { name: 'Philippines', code: '+63', iso: 'ph' },
  { name: 'Poland', code: '+48', iso: 'pl' },
  { name: 'Portugal', code: '+351', iso: 'pt' },
  { name: 'Qatar', code: '+974', iso: 'qa' },
  { name: 'Romania', code: '+40', iso: 'ro' },
  { name: 'Russia', code: '+7', iso: 'ru' },
  { name: 'Rwanda', code: '+250', iso: 'rw' },
  { name: 'Saudi Arabia', code: '+966', iso: 'sa' },
  { name: 'Senegal', code: '+221', iso: 'sn' },
  { name: 'Serbia', code: '+381', iso: 'rs' },
  { name: 'Seychelles', code: '+248', iso: 'sc' },
  { name: 'Sierra Leone', code: '+232', iso: 'sl' },
  { name: 'Singapore', code: '+65', iso: 'sg' },
  { name: 'Slovakia', code: '+421', iso: 'sk' },
  { name: 'Slovenia', code: '+386', iso: 'si' },
  { name: 'Somalia', code: '+252', iso: 'so' },
  { name: 'South Africa', code: '+27', iso: 'za' },
  { name: 'South Korea', code: '+82', iso: 'kr' },
  { name: 'Spain', code: '+34', iso: 'es' },
  { name: 'Sri Lanka', code: '+94', iso: 'lk' },
  { name: 'Sudan', code: '+249', iso: 'sd' },
  { name: 'Sweden', code: '+46', iso: 'se' },
  { name: 'Switzerland', code: '+41', iso: 'ch' },
  { name: 'Syria', code: '+963', iso: 'sy' },
  { name: 'Taiwan', code: '+886', iso: 'tw' },
  { name: 'Tajikistan', code: '+992', iso: 'tj' },
  { name: 'Tanzania', code: '+255', iso: 'tz' },
  { name: 'Thailand', code: '+66', iso: 'th' },
  { name: 'Togo', code: '+228', iso: 'tg' },
  { name: 'Trinidad and Tobago', code: '+1-868', iso: 'tt' },
  { name: 'Tunisia', code: '+216', iso: 'tn' },
  { name: 'Turkey', code: '+90', iso: 'tr' },
  { name: 'Turkmenistan', code: '+993', iso: 'tm' },
  { name: 'Uganda', code: '+256', iso: 'ug' },
  { name: 'Ukraine', code: '+380', iso: 'ua' },
  { name: 'United Arab Emirates', code: '+971', iso: 'ae' },
  { name: 'United Kingdom', code: '+44', iso: 'gb' },
  { name: 'United States', code: '+1', iso: 'us' },
  { name: 'Uruguay', code: '+598', iso: 'uy' },
  { name: 'Uzbekistan', code: '+998', iso: 'uz' },
  { name: 'Venezuela', code: '+58', iso: 've' },
  { name: 'Vietnam', code: '+84', iso: 'vn' },
  { name: 'Yemen', code: '+967', iso: 'ye' },
  { name: 'Zambia', code: '+260', iso: 'zm' },
  { name: 'Zimbabwe', code: '+263', iso: 'zw' },
] as const;
