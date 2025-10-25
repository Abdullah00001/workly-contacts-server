import LabelControllers from '@/modules/label/label.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const { handleCreateLabel } = LabelControllers;
const { checkAccessToken, checkSession } = UserMiddlewares;

const router = Router();

router.route('/label').post(checkAccessToken, checkSession, handleCreateLabel);

export default router;
