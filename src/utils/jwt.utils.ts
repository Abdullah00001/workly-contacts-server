import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '@/interfaces/jwtPayload.interfaces';
import { env } from '@/env';
import {
  accessTokenExpiresIn,
  activationTokenExpiresIn,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
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
    return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: refreshTokenExpiresIn,
    });
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
