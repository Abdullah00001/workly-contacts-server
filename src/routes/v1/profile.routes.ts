import { Router } from 'express';
import ProfileControllers from '@/modules/profile/profile.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import upload from '@/middlewares/multer.middleware';
import ProfileMiddlewares from '@/modules/profile/profile.middlewares';

const { checkAccessToken, checkSession } = UserMiddlewares;
const { profilePictureChangeInputValidation } = ProfileMiddlewares;
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
  .get(checkAccessToken, checkSession, handleGetProfile)
  .patch(checkAccessToken, checkSession, handleUpdateProfile)
  .post(checkAccessToken, checkSession, handleChangePassword)
  .delete(checkAccessToken, checkSession, handleDeleteAccount);
router
  .route('/me/avatar')
  .put(
    checkAccessToken,
    checkSession,
    upload.single('avatar'),
    handleAvatarUpload
  )
  .patch(
    checkAccessToken,
    checkSession,
    upload.single('avatar'),
    profilePictureChangeInputValidation,
    handleAvatarChange
  );
router
  .route('/me/avatar/:folder/:public_id')
  .delete(checkAccessToken, checkSession, handleAvatarRemove);

export default router;
