import IContacts, {
  IBulkChangeTrashStatusPayload,
  IChangeFavoriteStatusPayload,
  IChangeTrashStatusPayload,
  ICreateContactPayload,
  IDeleteManyContactPayload,
  IDeleteSingleContactPayload,
  IFindContactsPayload,
  IFindOneContactPayload,
  ISearchContact,
  IUpdateOneContactPayload,
} from '@/modules/contacts/contacts.interfaces';
import Contacts from '@/modules/contacts/contacts.models';
import User from '@/modules/user/user.models';
import mongoose from 'mongoose';

const ContactsRepositories = {
  createContact: async ({
    avatar,
    birthday,
    email,
    firstName,
    lastName,
    location,
    phone,
    worksAt,
    userId,
  }: ICreateContactPayload) => {
    try {
      const user = await User.findOne({ email: email });
      const payload = {
        avatar,
        birthday,
        email,
        firstName,
        lastName,
        location,
        phone,
        worksAt,
        userId,
        linkedUserId: user && user._id,
      } as IContacts;
      const newContact = new Contacts(payload);
      await newContact.save();
      return newContact;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Create Contacts Query');
      }
    }
  },
  updateOneContact: async ({
    contactId,
    avatar,
    birthday,
    email,
    firstName,
    lastName,
    location,
    phone,
    worksAt,
  }: IUpdateOneContactPayload) => {
    try {
      const payload = {
        avatar,
        birthday,
        email,
        firstName,
        lastName,
        location,
        phone,
        worksAt,
      } as IContacts;
      const data = await Contacts.findByIdAndUpdate(contactId, payload, {
        new: true,
      });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Update One Contacts Query');
      }
    }
  },
  findOneContact: async ({ contactId }: IFindOneContactPayload) => {
    try {
      return await Contacts.findById(contactId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find One Contacts Query');
      }
    }
  },
  changeFavoriteStatus: async ({
    contactId,
    isFavorite,
  }: IChangeFavoriteStatusPayload) => {
    try {
      return await Contacts.findByIdAndUpdate(
        contactId,
        { $set: { isFavorite } },
        { new: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Change Contacts Favorite Status Query'
        );
      }
    }
  },
  changeTrashStatus: async ({ contactId }: IChangeTrashStatusPayload) => {
    try {
      return await Contacts.findByIdAndUpdate(
        contactId,
        { $set: { isTrashed: true, isFavorite: false, trashedAt: Date.now() } },
        { new: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Change Contacts Trash Status Query'
        );
      }
    }
  },
  bulkChangeTrashStatus: async ({
    contactIds,
  }: IBulkChangeTrashStatusPayload) => {
    try {
      await Contacts.updateMany(
        { _id: { $in: contactIds } },
        { $set: { isTrashed: true, isFavorite: false, trashedAt: Date.now() } }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Bulk Change Contacts Trash Status Query'
        );
      }
    }
  },
  deleteSingleContact: async ({ contactId }: IDeleteSingleContactPayload) => {
    try {
      return await Contacts.findByIdAndDelete(contactId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Delete Single Contacts Query'
        );
      }
    }
  },
  deleteManyContact: async ({ contactIds }: IDeleteManyContactPayload) => {
    try {
      const [deletedContacts, deletedContactCount] = await Promise.all([
        Contacts.find({ _id: { $in: contactIds } }, { avatar: 1 }),
        (await Contacts.deleteMany({ _id: { $in: contactIds } })).deletedCount,
      ]);
      return { deletedContacts, deletedContactCount };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Delete Many Contacts Query');
      }
    }
  },
  findContacts: async ({ userId }: IFindContactsPayload) => {
    try {
      const objectUserId = new mongoose.Types.ObjectId(userId);
      return await Contacts.aggregate([
        { $match: { userId: objectUserId, isTrashed: false } },
        {
          $project: {
            _id: 1,
            avatar: 1,
            firstName: 1,
            lastName: 1,
            isTrashed: 1,
            isFavorite: 1,
            email: 1,
            phone: 1,
          },
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find Contacts Query');
      }
    }
  },
  findFavorites: async ({ userId }: IFindContactsPayload) => {
    const objectUserId = new mongoose.Types.ObjectId(userId);
    try {
      return await Contacts.aggregate([
        {
          $match: { userId: objectUserId, isTrashed: false, isFavorite: true },
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            firstName: 1,
            lastName: 1,
            isTrashed: 1,
            isFavorite: 1,
            email: 1,
            phone: 1,
          },
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find Find Favorites Query');
      }
    }
  },
  findTrash: async ({ userId }: IFindContactsPayload) => {
    const objectUserId = new mongoose.Types.ObjectId(userId);
    try {
      return await Contacts.aggregate([
        {
          $match: { userId: objectUserId, isTrashed: true },
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            firstName: 1,
            lastName: 1,
            isTrashed: 1,
            trashedAt: 1,
          },
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find Find Trash Query');
      }
    }
  },
  searchContact: async ({ query, userId }: ISearchContact) => {
    const regex = new RegExp(query, 'i');
    const objectUserId = new mongoose.Types.ObjectId(userId);
    try {
      return await Contacts.aggregate([
        {
          $match: {
            userId: objectUserId,
            isTrashed: false,
            $or: [{ name: regex }, { email: regex }, { phone: regex }],
          },
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
          },
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find Find Trash Query');
      }
    }
  },
  bulkRecoverTrash: async ({ contactIds }: IBulkChangeTrashStatusPayload) => {
    try {
      await Contacts.updateMany(
        { _id: { $in: contactIds } },
        { $set: { isTrashed: false, trashedAt: null } }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Bulk Recover Trash Contacts Status Query'
        );
      }
    }
  },
  recoverOneTrash: async ({ contactId }: IChangeTrashStatusPayload) => {
    try {
      await Contacts.findByIdAndUpdate(
        contactId,
        { $set: { isTrashed: false, trashedAt: null } },
        { new: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Single Recover Trash Query');
      }
    }
  },
  emptyTrash: async ({ userId }: IDeleteManyContactPayload) => {
    try {
      const [contacts, deleteResponse] = await Promise.all([
        Contacts.find({ userId, isTrashed: true }),
        Contacts.deleteMany({ userId, isTrashed: true }),
      ]);
      return { contacts, deletedCount: deleteResponse.deletedCount };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown Error Occurred In Empty Trash Query');
    }
  },
};

export default ContactsRepositories;
