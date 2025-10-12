import { Router } from 'express';
import UserMiddlewares from '@/modules/user/user.middlewares';
import upload from '@/middlewares/multer.middleware';
import ImageControllers from '@/modules/image/image.controllers';

const { checkAccessToken, checkSession } = UserMiddlewares;
const { handleImageUpload, handleImageDelete } = ImageControllers;

const router = Router();

router
  .route('/image')
  .post(
    checkAccessToken,
    checkSession,
    upload.single('image'),
    handleImageUpload
  );
router
  .route('/image/:folder/:public_id')
  .delete(checkAccessToken, checkSession, handleImageDelete);

export default router;
