import Handlebars from 'handlebars';
import mailTransporter from '@/configs/nodemailer.configs';
import mailOption from '@/utils/mailOption.utils';
import { verificationEmailTemplate } from '@/templates/verificationEmailTemplate';
import {
  IRecoveryEmailTemplateData,
  IVerificationEmailData,
} from '@/interfaces/verificationEmailData.interfaces';
import { dashboardUrl, profileUrl, supportEmail } from '@/const';
import { accountRecoveryEmailTemplate } from '@/templates/accountRecoveryEmailTemplate';
import {
  IPasswordResetNotificationTemplateData,
  IResetPasswordSendEmailPayload,
} from '@/modules/user/user.interfaces';
import { passwordResetNotificationTemplate } from '@/templates/passwordResetNotificationTemplate';
import DateUtils from '@/utils/date.utils';

const { formatDateTime } = DateUtils;

const SendEmail = {
  sendAccountVerificationOtpEmail: async (data: IVerificationEmailData) => {
    try {
      const template = Handlebars.compile(verificationEmailTemplate);
      const personalizedTemplate = template(data);
      await mailTransporter.sendMail(
        mailOption(
          data.email,
          'Email Verification Required',
          personalizedTemplate
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Send Account Verification Otp Email Utility'
        );
      }
    }
  },
  sendAccountRecoverOtpEmail: async ({
    email,
    expirationTime,
    name,
    otp,
  }: IVerificationEmailData) => {
    try {
      const data: IRecoveryEmailTemplateData = {
        expirationTime,
        name,
        otp,
        companyName: 'Workly Contacts',
        supportEmail,
        year: new Date().getFullYear(),
      };
      const template = Handlebars.compile(accountRecoveryEmailTemplate);
      const personalizedTemplate = template(data);
      await mailTransporter.sendMail(
        mailOption(
          email,
          'Your Verification Code - Workly Contacts',
          personalizedTemplate
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Send Account Recover Otp Email Utility'
        );
      }
    }
  },
  sendPasswordResetNotificationEmail: async ({
    device,
    email,
    ipAddress,
    location,
    name,
  }: IResetPasswordSendEmailPayload) => {
    try {
      const data: IPasswordResetNotificationTemplateData = {
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
      const personalizedTemplate = template(data);
      await mailTransporter.sendMail(
        mailOption(
          email,
          'Security Alert: Your Password Was Reset',
          personalizedTemplate
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Send Password Reset Notification Email Utility'
        );
      }
    }
  },
};

export default SendEmail;
