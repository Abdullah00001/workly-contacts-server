import ILabel from '@/modules/label/label.interfaces';
import { model, Model, Schema } from 'mongoose';

const LabelSchema = new Schema<ILabel>(
  {
    labelName: { type: String, required: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Label: Model<ILabel> = model<ILabel>('User', LabelSchema);

export default Label;
