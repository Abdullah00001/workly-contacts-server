import { IImage, TImage } from '@/modules/contacts/contacts.interfaces';
import { GenderType } from '@/modules/profile/profile.enums';
import { TPassword } from '@/modules/user/user.interfaces';
import { Document, Types } from 'mongoose';

export interface IWorksAt {
  company: string;
  position: string;
}

export type TLocation = {
  home: string | null;
  work: string | null;
};

export type TGender = GenderType | null;

interface IProfile extends Document {
  bio: string;
  location: TLocation;
  dateOfBirth: string;
  user: Types.ObjectId;
  gender: TGender;
}

export interface IProfilePayload {
  bio?: string;
  location?: TLocation;
  dateOfBirth?: string;
  user?: Types.ObjectId;
  profileId?: Types.ObjectId;
  queryFieldList?: string[];
  name?: string;
  phone?: string;
  avatar?: TImage;
  password?: TPassword;
  gender?: TGender;
  addPasswordPageToken?: string;
}
export interface IProfileProjection {
  location?: string;
  dateOfBirth?: string;
  user?: number;
  name?: number;
  phone?: number;
  avatar?: number;
  gender?: string;
  _id: number;
  email?: number;
}

export type TProfileProjection = {
  location?: number;
  dateOfBirth?: number;
  email?: number;
  user?: number;
  name?: number;
  phone?: number;
  avatar?: number;
  gender?: number;
};

export interface IGetProfilePayload {
  user?: Types.ObjectId;
  query?: IProfileProjection;
  queryFieldList?: string[];
}

export interface IGetProfileData {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: IImage;
  phone?: string;
  location?: TLocation;
  dateOfBirth?: string;
  gender?: TGender;
}

export interface IProcessAvatarUpload {
  user: Types.ObjectId;
  fileName: string;
}

export interface IProcessAvatarChange {
  user: Types.ObjectId;
  fileName: string;
  publicId: string;
}

export interface IProcessAvatarRemove {
  user: Types.ObjectId;
  publicId: string;
}

export type TProcessDeleteAccount = {
  user: Types.ObjectId;
  browser: string;
  deviceType: string;
  os: string;
  location: string;
  ipAddress: string;
  accessToken: string;
  refreshToken: string;
  sid: string;
};

export type TAccountDeletionScheduleEmailPayload = {
  email: string;
  name: string;
  deleteAt: string;
  scheduleAt: string;
};

export interface IAccountDeletionMetaData {
  jobId: string;
  scheduleAt: string;
  deleteAt: string;
  userId: Types.ObjectId;
}

export default IProfile;
