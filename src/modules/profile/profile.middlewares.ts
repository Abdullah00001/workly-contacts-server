import logger from '@/configs/logger.configs';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path, { join } from 'path';

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
};

export default ProfileMiddlewares;
