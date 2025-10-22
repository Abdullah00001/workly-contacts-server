import IContacts, {
  IBirthDate,
  IImage,
  ILocation,
  IPhone,
  IWorksAt,
} from '@/modules/contacts/contacts.interfaces';
import { model, Model, Schema } from 'mongoose';

const BirthDaySchema = new Schema<IBirthDate>(
  {
    day: { type: Number, default: null },
    month: { type: String, default: null },
    year: { type: Number, default: null },
  },
  { _id: false }
);

export const AvatarSchema = new Schema<IImage>(
  {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
  },
  { _id: false }
);

const WorksAtSchema = new Schema<IWorksAt>(
  {
    companyName: { type: String, default: null },
    jobTitle: { type: String, default: null },
  },
  { _id: false }
);

const PhoneSchema = new Schema<IPhone>(
  {
    countryCode: { type: String, default: null, index: true },
    number: { type: String, default: null, index: true },
  },
  { _id: false }
);

const LocationSchema = new Schema<ILocation>(
  {
    city: { type: String, default: null },
    country: { type: String, default: null },
    streetAddress: { type: String, default: null },
    postCode: { type: Number, default: null },
  },
  { _id: false }
);

const ContactsSchema = new Schema<IContacts>(
  {
    avatar: { type: AvatarSchema, default: () => ({}) },
    birthday: { type: BirthDaySchema, default: () => ({}) },
    email: { type: String, default: null, index: true },
    firstName: { type: String, default: null, index: true },
    lastName: { type: String, default: null, index: true },
    phone: { type: PhoneSchema, default: () => ({}) },
    isTrashed: { type: Boolean, default: false, index: true },
    isFavorite: { type: Boolean, default: false },
    trashedAt: { type: Date, default: null, index: true },
    userId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
      required: true,
    },
    location: { type: LocationSchema, default: () => ({}) },
    worksAt: { type: WorksAtSchema, default: () => ({}) },
    linkedUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const Contacts: Model<IContacts> = model<IContacts>('Contacts', ContactsSchema);

export default Contacts;
