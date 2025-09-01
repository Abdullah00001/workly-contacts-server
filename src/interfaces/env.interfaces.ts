export default interface IEnvConfig {
  MONGODB_URI: string;
  REDIS_URI: string;
  NODE_ENV: string;
  JWT_ACCESS_TOKEN_SECRET_KEY: string;
  JWT_REFRESH_TOKEN_SECRET_KEY: string;
  JWT_RECOVER_SESSION_TOKEN_SECRET_KEY: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET_KEY: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  CALLBACK_URL: string;
  CLIENT_BASE_URL: string;
  OTP_HASH_SECRET: string;
  JWT_ACTIVATION_TOKEN_SECRET_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
  SERVER_BASE_URL:string
}
