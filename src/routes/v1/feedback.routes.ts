import FeedbackControllers from '@/modules/feedback/feedback.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const { checkAccessToken, checkSession } = UserMiddlewares;
const { handleCreateFeedBack } = FeedbackControllers;

const router = Router();

router
  .route('/feedback')
  .post(checkAccessToken, checkSession, handleCreateFeedBack);

export default router;
