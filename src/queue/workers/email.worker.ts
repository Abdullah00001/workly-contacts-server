import logger from '@/configs/logger.configs';
import mailTransporter from '@/configs/nodemailer.configs';
import redisClient from '@/configs/redis.configs';
import {
  IRecoveryEmailTemplateData,
  IVerificationEmailData,
} from '@/interfaces/verificationEmailData.interfaces';
import { verificationEmailTemplate } from '@/templates/verificationEmailTemplate';
import DateUtils from '@/utils/date.utils';
import mailOption from '@/utils/mailOption.utils';
import { Job, Worker } from 'bullmq';
import Handlebars from 'handlebars';
import { dashboardUrl, profileUrl, supportEmail } from '@/const';
import { accountRecoveryEmailTemplate } from '@/templates/accountRecoveryEmailTemplate';
import {
  IPasswordResetNotificationTemplateData,
  IResetPasswordSendEmailPayload,
  TAccountLockedEmailPayload,
  TAccountUnlockedEmailPayload,
  TLoginSuccessEmailPayload,
  TSignupSuccessEmailPayloadData,
} from '@/modules/user/user.interfaces';
import { passwordResetNotificationTemplate } from '@/templates/passwordResetNotificationTemplate';
import { ILoginEmailPayload } from '@/interfaces/securityEmail.interfaces';
import failedLoginAttemptEmailTemplate from '@/templates/failedLoginAttemptEmailTemplate';
import signupSuccessEmailTemplate from '@/templates/signupSuccessEmailTemplate';
import loginSuccessEmailTemplate from '@/templates/loginSuccessEmailTemplate';
import { accountLockedEmailTemplate } from '@/templates/accountLockedEmailTemplate';
import { accountUnlockedEmailTemplate } from '@/templates/accountUnLockedEmailTemplate';
import { TAccountDeletionScheduleEmailPayload } from '@/modules/profile/profile.interfaces';
import accountDeletionScheduleEmailTemplate from '@/templates/accountDeletationScheduleEmailTemplate';

const { formatDateTime } = DateUtils;

const worker = new Worker(
  'email-queue',
  async (job: Job) => {
    const { name, data, id } = job;
    try {
      if (name === 'send-account-verification-otp-email') {
        const template = Handlebars.compile(verificationEmailTemplate);
        const personalizedTemplate = template(data);
        await mailTransporter.sendMail(
          mailOption(
            data.email,
            'Email Verification Required',
            personalizedTemplate
          )
        );
        return;
      }
      if (name === 'send-account-recover-otp-email') {
        const { email, expirationTime, name, otp } =
          data as IVerificationEmailData;
        const templateData: IRecoveryEmailTemplateData = {
          expirationTime,
          name,
          otp,
          companyName: 'Workly Contacts',
          supportEmail,
          year: new Date().getFullYear(),
        };
        const template = Handlebars.compile(accountRecoveryEmailTemplate);
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(
            email,
            'Your Verification Code - Workly Contacts',
            personalizedTemplate
          )
        );
        return;
      }
      if (name === 'send-password-reset-notification-email') {
        const { device, email, ipAddress, location, name } =
          data as IResetPasswordSendEmailPayload;
        const templateData: IPasswordResetNotificationTemplateData = {
          dashboardUrl,
          device,
          ipAddress,
          location,
          name,
          profileUrl,
          resetDateTime: formatDateTime(new Date().toISOString()),
          supportEmail,
        };
        const template = Handlebars.compile(passwordResetNotificationTemplate);
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(
            email,
            'Security Alert: Your Password Was Reset',
            personalizedTemplate
          )
        );
        return;
      }
      if (name === 'send-login-failed-notification-email') {
        const { browser, device, email, ip, location, name, os, time } =
          data as ILoginEmailPayload;
        const templateData = { browser, device, ip, location, name, os, time };
        const template = Handlebars.compile(failedLoginAttemptEmailTemplate);
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(
            email,
            'Security Alert: Some One Try to Access Your Account',
            personalizedTemplate
          )
        );
        return;
      }
      if (name === 'send-signup-success-notification-email') {
        const { email, name } = data as TSignupSuccessEmailPayloadData;
        const templateData = { email, name };
        const template = Handlebars.compile(signupSuccessEmailTemplate);
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(email, 'Welcome To Workly Contacts', personalizedTemplate)
        );
        return;
      }
      if (name === 'send-login-success-notification-email') {
        const { email, name, browser, device, ip, location, os, time } =
          data as TLoginSuccessEmailPayload;
        const templateData = { name, browser, device, ip, location, os, time };
        const template = Handlebars.compile(loginSuccessEmailTemplate);
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(
            email,
            'New sign-in detected on your workly account',
            personalizedTemplate
          )
        );
        return;
      }
      if (name === 'send-account-lock-notification-email') {
        const { activeLink, name, time, email } =
          data as TAccountLockedEmailPayload;
        const templateData = { activeLink, name, time };
        const template = Handlebars.compile(accountLockedEmailTemplate);
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(
            email,
            'Action Required: Your workly-contact account has been locked',
            personalizedTemplate
          )
        );
        return;
      }
      if (name === 'send-account-unlock-notification-email') {
        const { name, time, email } = data as TAccountUnlockedEmailPayload;
        const templateData = { name, time };
        const template = Handlebars.compile(accountUnlockedEmailTemplate);
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(
            email,
            'Your workly-contact account is now active',
            personalizedTemplate
          )
        );
        return;
      }
      if (name === 'send-account-schedule-deletion-notification-email') {
        const { name, deleteAt, scheduleAt, email } =
          data as TAccountDeletionScheduleEmailPayload;
        const templateData = { name, deleteAt, scheduleAt, email };
        const template = Handlebars.compile(
          accountDeletionScheduleEmailTemplate
        );
        const personalizedTemplate = template(templateData);
        await mailTransporter.sendMail(
          mailOption(
            email,
            'Your Workly Contacts account is scheduled for deletion',
            personalizedTemplate
          )
        );
        return;
      }
    } catch (error) {
      logger.error('Worker job failed', { jobName: name, jobId: id, error });
      throw error;
    }
  },
  { connection: redisClient }
);

worker.on('completed', (job: Job) => {
  logger.info(`Job Name : ${job.name} Job Id : ${job.id} Completed`);
});

worker.on('failed', (job: Job | undefined, error: Error) => {
  if (!job) {
    logger.error(
      `A job failed but the job data is undefined.\nError:\n${error}`
    );
    return;
  }
  logger.error(
    `Job Name : ${job.name} Job Id : ${job.id} Failed\nError:\n${error}`
  );
});
