import { env } from '@/env';
import { OtpUtils } from '@/utils/otp.utils';

let otpUtilsInstance: OtpUtils | null = null;

export const OtpUtilsSingleton = (): OtpUtils => {
  if (!otpUtilsInstance) {
    otpUtilsInstance = new OtpUtils(env.OTP_HASH_SECRET);
  }
  return otpUtilsInstance;
};
