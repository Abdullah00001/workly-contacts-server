import LabelControllers from '@/modules/label/label.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const {
  handleCreateLabel,
  handleUpdateLabel,
  handleDeleteLabel,
  handleRetrieveLabels,
} = LabelControllers;
const { checkAccessToken, checkSession } = UserMiddlewares;

const router = Router();

router
  .route('/label')
  .post(checkAccessToken, checkSession, handleCreateLabel)
  .get(checkAccessToken, checkSession, handleRetrieveLabels);
router
  .route('/label/:id')
  .patch(checkAccessToken, checkSession, handleUpdateLabel)
  .delete(checkAccessToken, checkSession, handleDeleteLabel);

export default router;
