import Contacts from '@/modules/contacts/contacts.models';
import {
  TCreateLabel,
  TDeleteLabel,
  TUpdateLabel,
} from '@/modules/label/label.interfaces';
import Label from '@/modules/label/label.models';
import mongoose, { Types } from 'mongoose';

const LabelRepositories = {
  createLabel: async ({ labelName, userId }: TCreateLabel) => {
    try {
      const newLabel = new Label({ labelName, createdBy: userId });
      return await newLabel.save();
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in label creation query');
    }
  },
  updateLabel: async ({ labelId, labelName, userId }: TUpdateLabel) => {
    try {
      return await Label.findByIdAndUpdate(
        { _id: labelId, createdBy: userId },
        { $set: { labelName } },
        { new: true }
      );
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in label update query');
    }
  },
  getLabels: async (userId: Types.ObjectId) => {
    try {
      const labels = await Label.aggregate([
        { $match: { createdBy: userId } },
        {
          $lookup: {
            from: 'contacts',
            localField: '_id',
            foreignField: 'labels',
            as: 'contacts',
          },
        },
        {
          $project: {
            labelName: 1,
            createdAt: 1,
            updatedAt: 1,
            contactCount: { $size: '$contacts' },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      return labels;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in label get query');
    }
  },
  deleteLabel: async ({ labelId, userId, withContacts }: TDeleteLabel) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (withContacts) {
        await Contacts.deleteMany({
          labels: labelId,
          createdBy: userId,
        }).session(session);
      } else {
        await Contacts.updateMany(
          { labels: labelId, createdBy: userId },
          { $pull: { labels: labelId } }
        ).session(session);
      }
      await Label.deleteOne({ _id: labelId, createdBy: userId }).session(
        session
      );
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in label delete query');
    }
  },
};

export default LabelRepositories;
