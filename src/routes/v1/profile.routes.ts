import { Router } from 'express';
import ProfileControllers from '@/modules/profile/profile.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import upload from '@/middlewares/multer.middleware';
import ProfileMiddlewares from '@/modules/profile/profile.middlewares';

const { checkAccessToken } = UserMiddlewares;
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
  .get(checkAccessToken, handleGetProfile)
  .patch(checkAccessToken, handleUpdateProfile)
  .post(checkAccessToken, handleChangePassword)
  .delete(checkAccessToken, handleDeleteAccount);
router
  .route('/me/avatar')
  .put(checkAccessToken, upload.single('avatar'), handleAvatarUpload)
  .patch(
    checkAccessToken,
    upload.single('avatar'),
    profilePictureChangeInputValidation,
    handleAvatarChange
  );
router
  .route('/me/avatar/:folder/:public_id')
  .delete(checkAccessToken, handleAvatarRemove);

export default router;
