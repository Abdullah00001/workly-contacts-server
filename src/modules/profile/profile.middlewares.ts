import logger from '@/configs/logger.configs';
import UserRepositories from '@/modules/user/user.repositories';
import PasswordUtils from '@/utils/password.utils';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path, { join } from 'path';

const { findUserById } = UserRepositories;
const { comparePassword } = PasswordUtils;

const ProfileMiddlewares = {
  profilePictureChangeInputValidation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const fileName = req.file?.filename;
    const { publicId } = req.body;
    if (!fileName) {
      res.status(400).json({
        success: false,
        message: 'No uploaded file found,please upload a file!',
      });
      return;
    }
    if (!publicId || typeof publicId !== 'string') {
      const safePath = path.basename(fileName);
      const filePath = join(__dirname, '../../../public/temp', safePath);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error);
        } else {
          logger.error(
            'Unknown Error Occurred In Profile Picture Change Input Validation Middleware'
          );
        }
      }
      res.status(400).json({
        success: false,
        message: 'Upload failed due invalid input or missing field',
      });
      return;
    } else {
      next();
    }
  },
  checkCurrentPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { currentPassword } = req.body;
      const { sub } = req.decoded;
      const user = await findUserById(sub);
      const isPasswordMatch = await comparePassword(
        currentPassword,
        user.password.secret
      );
      if (!isPasswordMatch) {
        res
          .status(400)
          .json({ success: false, message: 'Invalid Current Password' });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error(
          'Unknown Error Occurred In Check Current Password Middleware'
        );
        next(new Error('Unknown Error In Check Current Password Middleware'));
      }
    }
  },
};

export default ProfileMiddlewares;
