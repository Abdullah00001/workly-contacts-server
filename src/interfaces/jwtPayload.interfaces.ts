import { AuthType } from '@/modules/user/user.enums';
import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  sub: string;
  sid?: string;
  rememberMe?: boolean;
  provider?: AuthType;
}

export interface IRefreshTokenPayload extends TokenPayload {
  refreshToken: string;
}
