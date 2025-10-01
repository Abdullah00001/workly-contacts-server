import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '@/interfaces/jwtPayload.interfaces';
import { env } from '@/env';
import {
  accessTokenExpiresIn,
  activationTokenExpiresIn,
  changePasswordPageTokenExpiresIn,
  clearDevicePageTokenExpireIn,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
  refreshTokenExpiresInWithoutRememberMe,
} from '@/const';

const JwtUtils = {
  generateAccessToken: (payload: TokenPayload | null): string => {
    if (!payload) {
      throw new Error('Generate AccessToken Payload Cant Be Null');
    }
    return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET_KEY as string, {
      expiresIn: accessTokenExpiresIn,
    });
  },
  generateRefreshToken: (payload: TokenPayload): string => {
    if (!payload) {
      throw new Error('Generate RefreshToken Payload Cant Be Null');
    }
    const { rememberMe, sub, sid } = payload;
    if (rememberMe) {
      return jwt.sign({ sub, sid }, env.JWT_REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: refreshTokenExpiresIn,
      });
    } else {
      return jwt.sign({ sub, sid }, env.JWT_REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: refreshTokenExpiresInWithoutRememberMe,
      });
    }
  },
  generateRecoverToken: (payload: TokenPayload | null): string => {
    if (!payload) {
      throw new Error('Generate RecoverToken Payload Cant Be Null');
    }
    return jwt.sign(payload, env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY, {
      expiresIn: recoverSessionExpiresIn,
    });
  },
  generateActivationToken: (payload: TokenPayload | null): string => {
    if (!payload) {
      throw new Error('Generate Activation Payload Cant Be Null');
    }
    return jwt.sign(payload, env.JWT_ACTIVATION_TOKEN_SECRET_KEY, {
      expiresIn: activationTokenExpiresIn,
    });
  },
  generateChangePasswordPageToken: (payload: TokenPayload | null): string => {
    if (!payload) {
      throw new Error(
        'Generate Change Password Page Token Payload Cant Be Null'
      );
    }
    return jwt.sign(payload, env.JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY, {
      expiresIn: changePasswordPageTokenExpiresIn,
    });
  },
  generateClearDevicePageToken: (payload: TokenPayload | null): string => {
    if (!payload) {
      throw new Error(
        'Generate Change Password Page Token Payload Cant Be Null'
      );
    }
    return jwt.sign(payload, env.JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY, {
      expiresIn: clearDevicePageTokenExpireIn,
    });
  },
  verifyClearDevicePageToken: (token: string | null): JwtPayload => {
    if (!token) {
      throw new Error('Clear Device Page Token Is Missing');
    }
    return jwt.verify(
      token,
      env.JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY
    ) as JwtPayload;
  },
  verifyChangePasswordPageToken: (token: string | null): JwtPayload => {
    if (!token) {
      throw new Error('Change Password Page Token Is Missing');
    }
    return jwt.verify(
      token,
      env.JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY
    ) as JwtPayload;
  },
  verifyAccessToken: (token: string | null): JwtPayload => {
    if (!token) {
      throw new Error('Access Token Is Missing');
    }
    return jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET_KEY) as JwtPayload;
  },
  verifyRefreshToken: (token: string): JwtPayload => {
    if (!token) {
      throw new Error('Refresh Token Is Missing');
    }
    return jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET_KEY) as JwtPayload;
  },

  verifyRecoverToken: (token: string): JwtPayload | null => {
    if (!token) {
      throw new Error('Recover Token Is Missing');
    }
    return jwt.verify(
      token,
      env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY
    ) as JwtPayload;
  },
  verifyActivationToken: (token: string): JwtPayload | null => {
    if (!token) {
      throw new Error('Activation Token Is Missing');
    }
    return jwt.verify(token, env.JWT_ACTIVATION_TOKEN_SECRET_KEY) as JwtPayload;
  },
};

export default JwtUtils;
