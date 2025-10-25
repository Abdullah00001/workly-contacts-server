import { TCreateLabel, TUpdateLabel } from '@/modules/label/label.interfaces';
import LabelRepositories from '@/modules/label/label.repositories';

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
};

export default LabelServices;
