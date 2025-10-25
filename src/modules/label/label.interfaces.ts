import { Document, Types } from 'mongoose';

interface ILabel extends Document {
  labelName: string;
  createdBy: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export type TCreateLabel = {
  userId: Types.ObjectId;
  labelName: string;
};

export type TUpdateLabel = {
  userId: Types.ObjectId;
  labelName: string;
  labelId: Types.ObjectId;
};

export type TDeleteLabel = {
  userId: Types.ObjectId;
  labelId: Types.ObjectId;
  withContacts: boolean;
};

export default ILabel;
