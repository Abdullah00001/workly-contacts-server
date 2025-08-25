import IEnvConfig from '@/interfaces/env.interfaces';
import { getEnvVariable } from '@/utils/getEnvVariables.utils';

export const env: IEnvConfig = {
  MONGODB_URI: getEnvVariable('MONGODB_URI'),
  REDIS_URI: getEnvVariable('REDIS_URI'),
  NODE_ENV: getEnvVariable('NODE_ENV'),
  JWT_ACCESS_TOKEN_SECRET_KEY: getEnvVariable('JWT_ACCESS_TOKEN_SECRET_KEY'),
  JWT_REFRESH_TOKEN_SECRET_KEY: getEnvVariable('JWT_REFRESH_TOKEN_SECRET_KEY'),
  SMTP_HOST: getEnvVariable('SMTP_HOST'),
  SMTP_PORT: parseInt(getEnvVariable('SMTP_PORT')),
  SMTP_USER: getEnvVariable('SMTP_USER'),
  SMTP_PASS: getEnvVariable('SMTP_PASS'),
  CLOUDINARY_NAME: getEnvVariable('CLOUDINARY_NAME'),
  CLOUDINARY_API_KEY: getEnvVariable('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET_KEY: getEnvVariable('CLOUDINARY_API_SECRET_KEY'),
  JWT_RECOVER_SESSION_TOKEN_SECRET_KEY: getEnvVariable(
    'JWT_RECOVER_SESSION_TOKEN_SECRET_KEY'
  ),
  GOOGLE_CLIENT_ID: getEnvVariable('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnvVariable('GOOGLE_CLIENT_SECRET'),
  CALLBACK_URL: getEnvVariable('CALLBACK_URL'),
  CLIENT_BASE_URL: getEnvVariable('CLIENT_BASE_URL'),
  OTP_HASH_SECRET:getEnvVariable('OTP_HASH_SECRET')
};
