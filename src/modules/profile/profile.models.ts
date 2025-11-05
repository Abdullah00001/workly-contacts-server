import { model, Model, Schema } from 'mongoose';
import IProfile, { TLocation } from '@/modules/profile/profile.interfaces';

const LocationSchema = new Schema<TLocation>(
  {
    home: { type: String, default: null },
    work: { type: String, default: null },
  },
  { _id: false }
);

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'User',
      required: true,
    },
    bio: { type: String, default: null },
    dateOfBirth: { type: String, default: null },
    location: LocationSchema,
    gender: { type: String, default: null },
  },
  { timestamps: true }
);

const Profile: Model<IProfile> = model<IProfile>('Profile', ProfileSchema);

export default Profile;
