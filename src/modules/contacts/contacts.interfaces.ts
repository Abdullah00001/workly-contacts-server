import { Month } from '@/modules/contacts/contacts.enums';
import { Types } from 'mongoose';

export interface IWorksAt {
  companyName: string;
  jobTitle: string;
}

export interface IPhone {
  countryCode: string;
  number: string;
}

export interface ILocation {
  country: string;
  city: string;
  postCode: number;
  streetAddress: string;
}

export interface IBirthDate {
  day: number;
  month: Month;
  year: number;
}

export interface IImage {
  url: string;
  publicId: string;
}

interface IContacts {
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  avatar: IImage;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone: IPhone;
  worksAt: IWorksAt;
  location: ILocation;
  birthday: IBirthDate;
  isFavorite: boolean;
  isTrashed: boolean;
  trashedAt: Date;
  linkedUserId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IChangeFavoriteStatusPayload {
  isFavorite?: boolean;
  userId?: Types.ObjectId;
  contactId?: Types.ObjectId;
}

export interface IChangeTrashStatusPayload {
  isTrashed?: boolean;
  userId?: Types.ObjectId;
  contactId?: Types.ObjectId;
}

export interface IBulkChangeTrashStatusPayload {
  userId?: Types.ObjectId;
  contactIds?: Types.ObjectId[];
}

export interface IDeleteSingleContactPayload {
  userId?: Types.ObjectId;
  contactId?: Types.ObjectId;
}

export interface IDeleteManyContactPayload {
  userId?: Types.ObjectId;
  contactIds?: Types.ObjectId[];
}

export interface IFindOneContactPayload {
  contactId: Types.ObjectId;
  userId?: Types.ObjectId;
}

export type TImage = {
  url: string | null;
  publicId: string | null;
};

export interface IUpdateOneContactPayload {
  avatarUpload?: string;
  avatar?: TImage;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: IPhone;
  worksAt?: IWorksAt;
  location?: ILocation;
  birthday?: IBirthDate;
  userId?: Types.ObjectId;
  contactId: Types.ObjectId;
}

export type TUploadImage = {
  response: IImage | null;
};

export interface ICreateContactPayload {
  avatar?: IImage;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: IPhone;
  worksAt?: IWorksAt;
  location?: ILocation;
  birthday?: IBirthDate;
  isFavorite?: boolean;
  isTrashed?: boolean;
  trashedAt?: Date;
  userId?: Types.ObjectId;
}

export interface IFindContactsPayload {
  userId: Types.ObjectId;
}

export interface ISearchContact {
  query: string;
  userId: Types.ObjectId;
}

export default IContacts;
