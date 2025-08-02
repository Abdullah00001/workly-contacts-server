import { IImage } from '@/modules/contacts/contacts.interfaces';
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
  name?: string;
  phone?: string;
  avatar?: IImage;
  password?: TPassword;
}

export interface IGetProfileData {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: IImage;
  phone?: string;
}

export default IProfile;
