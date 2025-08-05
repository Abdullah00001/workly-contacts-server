import { ILoginEmailPayload } from '@/interfaces/securityEmail.interfaces';
import { IVerificationEmailData } from '@/interfaces/verificationEmailData.interfaces';
import { IResetPasswordSendEmailPayload } from '@/modules/user/user.interfaces';
import { EmailQueue } from '@/queue/queues';

const EmailQueueJobs = {
  addSendAccountVerificationOtpEmailToQueue: async (
    data: IVerificationEmailData
  ) => {
    await EmailQueue.add('send-account-verification-otp-email', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  addSendAccountRecoverOtpEmailToQueue: async (
    data: IVerificationEmailData
  ) => {
    await EmailQueue.add('send-account-recover-otp-email', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  addSendPasswordResetNotificationEmailToQueue: async (
    data: IResetPasswordSendEmailPayload
  ) => {
    await EmailQueue.add('send-password-reset-notification-email', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
  loginFailedNotificationEmailToQueue: async (data: ILoginEmailPayload) => {
    await EmailQueue.add('send-login-failed-notification-email', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
};

export default EmailQueueJobs;
