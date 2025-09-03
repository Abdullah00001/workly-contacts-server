import { model, Model, Schema } from 'mongoose';
import IUser, {
  IActivity,
  IPassword,
  TAccountStatus,
} from '@/modules/user/user.interfaces';
import PasswordUtils from '@/utils/password.utils';
import { AvatarSchema } from '@/modules/contacts/contacts.models';
import { AccountStatus, ActivityType } from '@/modules/user/user.enums';

const { hashPassword } = PasswordUtils;

const PasswordSchema = new Schema<IPassword>(
  {
    secret: { type: String, default: null },
    change_at: { type: String, default: null },
  },
  { _id: false }
);

const AccountStatusSchema = new Schema<TAccountStatus>(
  {
    accountStatus: {
      type: String,
      enum: AccountStatus,
      default: AccountStatus.ACTIVE,
    },
    lockedAt: { type: String, default: null },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: PasswordSchema,
    avatar: AvatarSchema,
    isVerified: { type: Boolean, default: false },
    phone: { type: String, default: null },
    googleId: { type: String, default: null },
    provider: { type: String, required: true },
    accountStatus: AccountStatusSchema,
  },
  { timestamps: true }
);

const ActivitySchema = new Schema<IActivity>(
  {
    activityType: { type: String, enum: ActivityType, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    device: { type: String, required: true },
    browser: { type: String, required: true },
    ipAddress: { type: String, required: true },
    location: { type: String, required: true },
    os: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (user.isModified('password') || user.isNew) {
    try {
      if (user.password.secret) {
        user.password.secret = (await hashPassword(
          user.password.secret
        )) as string;
        user.password.change_at = new Date().toISOString();
        next();
      } else {
        next();
      }
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      } else {
        throw new Error('Unknown error occurred in password hash middleware');
      }
    }
  }
});

const User: Model<IUser> = model<IUser>('User', UserSchema);
export const Activity: Model<IActivity> = model<IActivity>(
  'Activity',
  ActivitySchema
);

export default User;
