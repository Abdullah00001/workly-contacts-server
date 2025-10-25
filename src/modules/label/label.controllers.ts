import { Request, Response, NextFunction } from 'express';
import logger from '@/configs/logger.configs';
import LabelServices from '@/modules/label/label.services';
import mongoose from 'mongoose';

const { processCreateLabel } = LabelServices;

const LabelControllers = {
  handleCreateLabel: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { sub } = req.decoded;
      const { labelName } = req.body;
      const data = await processCreateLabel({
        labelName,
        userId: new mongoose.Types.ObjectId(sub),
      });
      res
        .status(201)
        .json({ success: true, message: 'new label created', data });
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};

export default LabelControllers;
