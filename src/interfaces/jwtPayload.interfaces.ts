import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  sub: string;
  sid?: string;
  rememberMe?: boolean;
}

export interface IRefreshTokenPayload extends TokenPayload {
  refreshToken: string;
}
