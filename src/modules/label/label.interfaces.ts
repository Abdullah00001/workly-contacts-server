import { Document, Types } from 'mongoose';

interface ILabel extends Document {
  labelName: string;
  createdBy: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export default ILabel
