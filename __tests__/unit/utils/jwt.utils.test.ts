import JwtUtils from '../../../src/utils/jwt.utils';
import { TokenPayload } from '../../../src/interfaces/jwtPayload.interfaces';
import { JsonWebTokenError } from 'jsonwebtoken';

const {
  generateAccessToken,
  generateRecoverToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRecoverToken,
  verifyRefreshToken,
} = JwtUtils;

const mockPayload: TokenPayload = {
  sub: '690a1f6e5db1dc990cd22e8c',
  sid: '94133faf-69f8-4831-88da-25a31e7c3f45',
};

const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

describe('JwtUtils', () => {
  describe('generateAccessToken Utility', () => {
    it('it should generate access token', () => {
      const token = generateAccessToken({ payload: mockPayload });
      expect(typeof token).toBe('string');
    });
    it('it should throw error while access token payload is missing or null', () => {
      expect(() => generateAccessToken(null)).toThrow(
        'Generate AccessToken Payload Cant Be Null'
      );
    });
  });

  describe('generateRefreshToken Utility', () => {
    it('it should generate refresh token', () => {
      const token = generateRefreshToken({ payload: mockPayload });
      expect(typeof token).toBe('string');
    });
    it('it should throw error while refresh token payload is missing or null', () => {
      expect(() => generateRefreshToken(null)).toThrow(
        'Generate RefreshToken Payload Cant Be Null'
      );
    });
  });

  describe('generateRecoverToken Utility', () => {
    it('it should generate Recover token', () => {
      const token = generateRecoverToken({ payload: mockPayload });
      expect(typeof token).toBe('string');
    });
    it('it should throw error while refresh token payload is missing or null', () => {
      expect(() => generateRecoverToken(null)).toThrow(
        'Generate RecoverToken Payload Cant Be Null'
      );
    });
  });

  describe('verifyAccessToken Utility', () => {
    it('is should be throw error when function got null', () => {
      expect(() => verifyAccessToken(null)).toThrow('Token Is Missing');
    });
    it('it should be throw error if the token is not verified', () => {
      expect(() => verifyAccessToken(mockToken)).toThrow(JsonWebTokenError);
    });
    it('it should be return decoded payload when token is verified', () => {
      const token = generateAccessToken(mockPayload);
      const result = verifyAccessToken(token) as TokenPayload;
      expect(result.sub).toBe(mockPayload.sub);
    });
  });

  describe('verifyRefreshToken Utility', () => {
    it('should throw error when function got null', () => {
      expect(() => verifyRefreshToken(null as any)).toThrow(
        'Refresh Token Is Missing'
      );
    });
    it('should throw error if the token is not verified', () => {
      expect(() => verifyRefreshToken(mockToken)).toThrow(JsonWebTokenError);
    });
    it('should return decoded payload when token is verified', () => {
      const token = generateRefreshToken(mockPayload);
      const result = verifyRefreshToken(token) as TokenPayload;
      expect(result.sub).toBe(mockPayload.sub);
    });
  });

  describe('verifyRecoverToken Utility', () => {
    it('should throw error when function got null', () => {
      expect(() => verifyRecoverToken(null as any)).toThrow(
        'Recover Token Is Missing'
      );
    });
    it('should throw error if the token is not verified', () => {
      expect(() => verifyRecoverToken(mockToken)).toThrow(JsonWebTokenError);
    });
    it('should return decoded payload when token is verified', () => {
      const token = generateRecoverToken(mockPayload);
      const result = verifyRecoverToken(token) as TokenPayload;
      expect(result.sub).toBe(mockPayload.sub);
    });
  });
});
