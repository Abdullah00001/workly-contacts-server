import { Router } from 'express';
import ProfileControllers from '@/modules/profile/profile.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import upload from '@/middlewares/multer.middleware';

const { checkAccessToken } = UserMiddlewares;
const {
  handleGetProfile,
  handleUpdateProfile,
  handleChangePassword,
  handleDeleteAccount,
  handleAvatarUpload,
  handleAvatarRemove,
  handleAvatarChange,
} = ProfileControllers;

const router = Router();

router
  .route('/me')
  .get(checkAccessToken, handleGetProfile)
  .patch(checkAccessToken, handleUpdateProfile)
  .post(checkAccessToken, handleChangePassword)
  .delete(checkAccessToken, handleDeleteAccount);
router
  .route('/me/avatar')
  .put(checkAccessToken, upload.single('avatar'), handleAvatarUpload)
  .patch(checkAccessToken, upload.single('avatar'), handleAvatarChange);
router
  .route('/me/avatar/:folder/:public_id')
  .delete(checkAccessToken, handleAvatarRemove);

export default router;
