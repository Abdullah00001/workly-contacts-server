import mailTransporter from '@/configs/nodemailer.configs';
import { env } from '@/env';
import IFeedBack, {
  TProcessCreateFeedBack,
} from '@/modules/feedback/feedback.interfaces';
import FeedbackRepositories from '@/modules/feedback/feedback.repositories';
import UserRepositories from '@/modules/user/user.repositories';

const { createFeedBack } = FeedbackRepositories;
const { findUserById } = UserRepositories;
const { SMTP_USER } = env;

const FeedbackServices = {
  processCreateFeedBack: async ({
    message,
    userId,
  }: TProcessCreateFeedBack) => {
    try {
      const { email } = await findUserById(userId);
      const payload = { userEmail: email, message };
      await createFeedBack(payload);
      await mailTransporter.sendMail({
        from: SMTP_USER,
        to: SMTP_USER,
        replyTo: payload.userEmail,
        subject: 'New Feed Back',
        text: payload.message,
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In createFeedBack Service');
      }
    }
  },
};

export default FeedbackServices;
