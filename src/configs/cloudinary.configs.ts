import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { env } from '@/env';
import fs from 'fs';
import logger from '@/configs/logger.configs';
import axios from 'axios';

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET_KEY, CLOUDINARY_NAME } = env;

const CloudinaryConfigs = {
  initializedCloudinary: (): void => {
    const configuration: ConfigOptions = {
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET_KEY,
    };
    cloudinary.config(configuration);
  },
  upload: async (imagePath: string) => {
    try {
      if (!imagePath) {
        return null;
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(imagePath, {
        resource_type: 'auto',
        folder: 'amarcontacts',
      });
      fs.unlinkSync(imagePath);
      return {
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
      };
    } catch (error) {
      fs.unlinkSync(imagePath);
      if (error instanceof Error) {
        console.error(`Image Upload Failed\nMessage: ${error.message}`);
      } else {
        console.error(
          'An unexpected error occurred during the image upload process.'
        );
      }
      fs.unlinkSync(imagePath);
      return null;
    }
  },
  uploadAvatar: async (
    url: string
  ): Promise<{ publicId: string | null; url: string | null }> => {
    try {
      const response = await axios.get(url, { responseType: 'stream' });
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'amarcontacts',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            }
          }
        );
        response.data.pipe(uploadStream);
        response.data.on('error', (error: Error) => {
          logger.error('Google avatar download stream error:', error);
          uploadStream.destroy(); // Stop the upload if download fails
          reject(error);
        });
      });
    } catch (error) {
      logger.error('Google avatar upload failed:', error);
      return { publicId: null, url: null };
    }
  },
  destroy: async (publicId: string) => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(
        'Unknown error occurred in cloudinary image destroy operation'
      );
    }
  },
};

export default CloudinaryConfigs;
