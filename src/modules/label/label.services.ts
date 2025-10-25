import {
  TCreateLabel,
  TDeleteLabel,
  TUpdateLabel,
} from '@/modules/label/label.interfaces';
import LabelRepositories from '@/modules/label/label.repositories';
import { Types } from 'mongoose';

const { createLabel, deleteLabel, getLabels, updateLabel } = LabelRepositories;

const LabelServices = {
  processCreateLabel: async (payload: TCreateLabel) => {
    try {
      return await createLabel(payload);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in create label service');
    }
  },
  processUpdateLabel: async (payload: TUpdateLabel) => {
    try {
      return await updateLabel(payload);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in update label service');
    }
  },
  processDeleteLabel: async (payload: TDeleteLabel) => {
    try {
      await deleteLabel(payload);
      return;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in delete label service');
    }
  },
  processRetrieveLabels: async (payload: Types.ObjectId) => {
    try {
      return await getLabels(payload);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in delete label service');
    }
  },
};

export default LabelServices;
