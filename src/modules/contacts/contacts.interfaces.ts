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

export type TProcessImportContact = {
  fileName: string;
  userId: Types.ObjectId;
};

export type TContactPayload = {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: {
    countryCode: string | null;
    number: string | null;
  };
  birthday: {
    day: number | null;
    month: string | null;
    year: number | null;
  };
  location: {
    city: string | null;
    country: string | null;
    postCode: number | string | null;
    streetAddress: string | null;
  };
  worksAt: {
    companyName: string | null;
    jobTitle: string | null;
  };
  userId: Types.ObjectId;
};

export type TCsvFormat = {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  birthdayDate: number;
  birthdayMonth: number;
  birthdayYear: number;
  addressStreet: string;
  addressCity: string;
  addressCountry: string;
  addressPostCode: number;
  organizationName: string;
  organizationPosition: string;
};

export type TVCardFormat = {
  VERSION: string;
  FN: string;
  N: string;
  EMAIL: string;
  TEL: string;
  BDAY: string;
  ADR: string;
  ORG: string;
  TITLE: string;
};

export type TBulkInsertContacts = {
  contacts: TContactPayload[];
};

// Type definitions
export interface CSVContactRow {
  firstName?: string;
  lastName?: string;
  phone?: string;
  countryCode?: string;
  birthMonth?: string;
  birthDate?: string;
  birthYear?: string;
  [key: string]: string | undefined;
}

export interface ContactValidationError {
  row?: number;
  card?: number;
  field: string;
  message: string;
}

export interface PhoneValidation {
  phone?: string;
  countryCode?: string;
}

export interface BirthdayValidation {
  birthMonth?: string;
  birthDate?: string;
  birthYear?: string;
}

export type TProcessExportContact={
  userId:Types.ObjectId;
  contactIds:string[]|Types.ObjectId[]
}

export default IContacts;
