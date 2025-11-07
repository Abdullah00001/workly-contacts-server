import dotenv from 'dotenv';

// Load from .env file if it exists
dotenv.config();

// Core env
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// Database & cache
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db';
process.env.REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379';

// JWT secrets
process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
  process.env.JWT_ACCESS_TOKEN_SECRET_KEY || 'test-access-secret-key';
process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
  process.env.JWT_REFRESH_TOKEN_SECRET_KEY || 'test-refresh-secret-key';
process.env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY =
  process.env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY || 'test-recover-secret-key';

// SMTP / Email
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.test.com';
process.env.SMTP_PORT = process.env.SMTP_PORT || '587';
process.env.SMTP_USER = process.env.SMTP_USER || 'test@test.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'test-password';

// Cloudinary
process.env.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || 'test-cloudinary';
process.env.CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY || 'test-api-key';
process.env.CLOUDINARY_API_SECRET_KEY =
  process.env.CLOUDINARY_API_SECRET_KEY || 'test-api-secret';

// Google OAuth (this fixes your current error)
process.env.GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id';
process.env.GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret';
process.env.CALLBACK_URL =
  process.env.CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

// reCAPTCHA
process.env.RECAPTCHA_SECRET_KEY =
  process.env.RECAPTCHA_SECRET_KEY || 'mock-recaptcha-secret';

// Other app-related URLs
process.env.CLIENT_BASE_URL =
  process.env.CLIENT_BASE_URL || 'http://localhost:3000';
process.env.SERVER_BASE_URL =
  process.env.SERVER_BASE_URL || 'http://localhost:4000';
process.env.OTP_HASH_SECRET = process.env.OTP_HASH_SECRET || 'mock-otp-secret';
