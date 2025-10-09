import { IImage } from '@/modules/contacts/contacts.interfaces';
import {
  AccountStatus,
  ActivityType,
  AuthType,
  DeviceType,
} from '@/modules/user/user.enums';
import { Document, Types } from 'mongoose';

export interface IPassword {
  secret: string;
  change_at: string;
}

export type TPassword = {
  secret: string | null;
  change_at: string | null;
};

export type TAccountStatus = {
  accountStatus: AccountStatus;
  lockedAt: string | null;
};

interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: IPassword;
  isVerified: boolean;
  accountStatus: TAccountStatus;
  avatar: IImage;
  provider: AuthType;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TUpdateUserAccountStatus = {
  accountStatus: AccountStatus;
  lockedAt?: string;
  userId: Types.ObjectId;
};

export interface IActivity extends Document {
  activityType: ActivityType;
  title: string;
  description: string;
  device: string;
  os: string;
  browser: string;
  location: string;
  ipAddress: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityPayload {
  activityType: ActivityType;
  title: string;
  description: string;
  device: string;
  os: string;
  browser: string;
  location: string;
  ipAddress: string;
  user: Types.ObjectId;
}

export interface ISession {
  sessionId: string;
  refreshToken: string;
  os: string;
  browser: string;
  location: string;
  lastUsed: string;
}

export interface IGeoLocation {
  query: string;
  status: 'success' | 'fail';
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  district: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  offset: number;
  currency: string;
  isp: string;
  org: string;
  as: string;
  asname: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
}

export type TGeoLocation = {
  query?: string;
  status?: 'success' | 'fail';
  continent?: string;
  continentCode?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  district?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  offset?: number;
  currency?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
};

export interface IGetClientMetaData {
  browser: UAParser.IBrowser;
  device: UAParser.IDevice;
  os: UAParser.IOS;
  location: IGeoLocation;
  ip: string;
}

export interface IUserPayload {
  name?: string;
  email?: string;
  password?: TPassword;
  isVerified?: boolean;
  avatar?: IImage;
  userId?: Types.ObjectId;
  phone?: string;
  otp?: string;
  accessToken?: string;
  refreshToken?: string;
  provider?: AuthType;
  googleId?: string;
}

export interface IProcessFindUserReturn {
  r_stp1?: string;
  r_stp2?: string;
  r_stp3?: string;
}

export interface IProcessRecoverAccountPayload {
  userId: string;
  r_stp1?: string;
  r_stp2?: string;
  r_stp3?: string;
  rs_id?: string;
  password?: IPassword;
}

export interface IResetPasswordRepositoryPayload {
  password: IPassword;
  userId: Types.ObjectId;
}

export type TResetPasswordServicePayload = {
  userId: string;
  password: string;
  r_stp3: string;
  browser: string;
  deviceType: string;
  os: string;
  location: string;
  ipAddress: string;
};

export interface IResetPasswordServiceReturnPayload {
  accessToken: string;
  refreshToken: string;
}

export interface IResetPasswordSendEmailPayload {
  email: string;
  location: string;
  device: string;
  ipAddress: string;
  name: string;
}

export interface IPasswordResetNotificationTemplateData {
  supportEmail: string;
  dashboardUrl: string;
  profileUrl: string;
  location: string;
  device: string;
  ipAddress: string;
  resetDateTime: string;
  name: string;
}

export type TSession = {
  sessionId: string;
  createdAt: string;
  expiredAt: string;
  lastUsedAt: string;
  userId: string;
  deviceType: string;
  browser: string;
  os: string;
  location: string;
  currentSession?: boolean;
};

export type TProcessVerifyUserArgs = {
  userId: string;
  browser: string;
  deviceType: string;
  os: string;
  location: string;
  ipAddress: string;
};

export type TSignupSuccessEmailPayloadData = {
  email: string;
  name: string;
};

export type TProcessOAuthCallBackPayload = {
  user: IUser;
  activity: ActivityType;
  browser: string;
  deviceType: string;
  os: string;
  location: string;
  ipAddress: string;
};

export type TProcessLoginPayload = {
  user: IUser;
  browser: string;
  deviceType: string;
  os: string;
  location: string;
  ipAddress: string;
  rememberMe: boolean;
};

export type TLoginSuccessEmailPayload = {
  email: string;
  name: string;
  time: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  os: string;
};

export type TAccountLockedEmailPayload = {
  name: string;
  time: string;
  activeLink: string;
  email: string;
};

export interface TAccountUnlockedEmailPayload {
  name: string;
  time: string;
  email: string;
}

export type TProcessChangePasswordAndAccountActivation = {
  token: string;
  userId: string;
  uuid: string;
  password: string;
  browser: string;
  deviceType: string;
  os: string;
  location: string;
  ipAddress: string;
};

export type TChangePasswordAndAccountActivation = {
  password: string;
  userId: Types.ObjectId;
};

export type TProcessRefreshToken = {
  sid: string;
  userId: string;
};

export type TProcessLogout = {
  sid: string;
  userId: string;
  accessToken: string;
  refreshToken?: string;
};

export type TProcessCheckResendStatus = {
  userId: string;
};

export type TProcessRetrieveSessionsForClearDevice = {
  userId: string;
};

export type TProcessClearDeviceAndLoginPayload = {
  user: string;
  browser: string;
  deviceType: string;
  os: string;
  location: string;
  ipAddress: string;
  devices: string[];
  rememberMe?: boolean;
  provider?: AuthType;
};

export type TProcessFindUser = {
  userId: string;
};

export type SecurityOverviewData = {
  accountCreatedAt?: Date;
  lastPasswordChange?: string;
  lastLoginBrowser?: string;
  lastLoginOs?: string;
  lastLoginLocation?: string;
  lastLoginTime?: string;
};

export type TProcessActiveSessions = {
  sub: string;
  sid: string;
};

export type TProcessSessionsRemove = {
  sub: string;
  sessionId: string;
  sid: string;
};

export default IUser;
