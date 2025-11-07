import dotenv from 'dotenv';

// Load from .env file if it exists
dotenv.config();

// ===============================
//  General Configuration
// ===============================
// Core env
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// Other app-related URLs
process.env.CLIENT_BASE_URL =
  process.env.CLIENT_BASE_URL || 'http://localhost:3000';
process.env.SERVER_BASE_URL =
  process.env.SERVER_BASE_URL || 'http://localhost:4000';

// ===============================
//  Mongodb & Redis Configuration
// ===============================
// Database & cache
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db';

// Redis connection details from .env.example
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';
process.env.REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'test-password';

// Keep REDIS_URI in case any part of the test suite uses it directly
process.env.REDIS_URI =
  process.env.REDIS_URI ||
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

// ========================================
//  JSON Web Token (JWT) Secret Keys
// ========================================
process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
  process.env.JWT_ACCESS_TOKEN_SECRET_KEY || 'test-access-secret-key';
process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
  process.env.JWT_REFRESH_TOKEN_SECRET_KEY || 'test-refresh-secret-key';
process.env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY =
  process.env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY || 'test-recover-secret-key';
process.env.JWT_ACTIVATION_TOKEN_SECRET_KEY =
  process.env.JWT_ACTIVATION_TOKEN_SECRET_KEY || 'test-activation-secret-key';
process.env.JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY =
  process.env.JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY ||
  'test-change-password-secret-key';
process.env.JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY =
  process.env.JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY ||
  'test-clear-device-secret-key';
process.env.JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY =
  process.env.JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY ||
  'test-add-password-secret-key';

// ===============================
//  Authentication & Security
// ===============================
process.env.OTP_HASH_SECRET = process.env.OTP_HASH_SECRET || 'mock-otp-secret';
process.env.RECAPTCHA_SECRET_KEY =
  process.env.RECAPTCHA_SECRET_KEY || 'mock-recaptcha-secret';

// ===============================
//  Cloudinary Configuration
// ===============================
process.env.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || 'test-cloudinary';
process.env.CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY || 'test-api-key';
process.env.CLOUDINARY_API_SECRET_KEY =
  process.env.CLOUDINARY_API_SECRET_KEY || 'test-api-secret';

// ===============================
//  Email Configuration (SMTP)
// ===============================
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.test.com';
process.env.SMTP_PORT = process.env.SMTP_PORT || '587';
process.env.SMTP_USER = process.env.SMTP_USER || 'test@test.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'test-password';

// ===============================
//  Social Login (Google OAuth)
// ===============================
process.env.GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id';
process.env.GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret';
process.env.CALLBACK_URL =
  process.env.CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';
