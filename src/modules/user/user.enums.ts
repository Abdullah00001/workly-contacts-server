export enum AuthType {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export enum ActivityType {
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_ACTIVE = 'ACCOUNT_ACTIVE',
}

export enum AccountStatus {
  ACTIVE = 'active',
  ON_RISK = 'on_risk',
  LOCKED = 'locked',
}

export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
}

export enum AuthErrorType {
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_BLACKLISTED = 'SESSION_BLACKLISTED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_BLACKLISTED = 'TOKEN_BLACKLISTED',
}
