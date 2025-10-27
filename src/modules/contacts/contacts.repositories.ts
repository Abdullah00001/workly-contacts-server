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
  MatchCondition,
  QueryType,
  TAddLabel,
  TBulkInsertContacts,
  TProcessExportContact,
} from '@/modules/contacts/contacts.interfaces';
import Contacts from '@/modules/contacts/contacts.models';
import Label from '@/modules/label/label.models';
import User from '@/modules/user/user.models';
import mongoose, { Types } from 'mongoose';

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
            location: 1,
            worksAt: 1,
            labels: 1,
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
            location: 1,
            worksAt: 1,
            labels: 1,
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
          $sort: {
            trashedAt: -1,
          },
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
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const escapeRegex = (str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    // Detect query type
    const detectQueryType = (q: string): QueryType => {
      if (q.includes('@')) return 'email';
      if (/^[\d\+\-\s()]+$/.test(q)) return 'phone';
      return 'name';
    };
    const queryType = detectQueryType(query);
    const escapedQuery = escapeRegex(query);
    // Split query into words and create regex for each
    const words = query.trim().split(/\s+/);
    const regexArray = words.map((word) => new RegExp(escapeRegex(word), 'i'));
    try {
      const orConditions: MatchCondition[] = [];

      // Build conditions based on query type
      if (queryType === 'email') {
        orConditions.push({ email: new RegExp(`^${escapedQuery}$`, 'i') });
      } else if (queryType === 'phone') {
        orConditions.push(
          { 'phone.number': new RegExp(escapedQuery, 'i') },
          { 'phone.number': new RegExp(query.replace(/\D/g, ''), 'i') }
        );
      } else {
        // Name search
        const words = query.trim().split(/\s+/);

        // Match individual name fields
        orConditions.push(
          { firstName: new RegExp(escapedQuery, 'i') },
          { lastName: new RegExp(escapedQuery, 'i') }
        );

        // For multi-word queries, add full name matching
        if (words.length > 1) {
          const nameConditions: MatchCondition[] = words.map((word) => ({
            fullName: new RegExp(escapeRegex(word), 'i'),
          }));
          orConditions.push({ $and: nameConditions });
        }
      }
      return await Contacts.aggregate([
        {
          $match: {
            userId: objectUserId,
            isTrashed: false,
          },
        },
        {
          $addFields: {
            fullName: {
              $concat: [
                { $ifNull: ['$firstName', ''] },
                ' ',
                { $ifNull: ['$lastName', ''] },
              ],
            },
          },
        },
        {
          $match: {
            $or: orConditions,
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
  bulkInsertContacts: async ({ contacts }: TBulkInsertContacts) => {
    try {
      const writContact = await Contacts.insertMany(contacts);
      return writContact;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown Error Occurred In Bulk Insert Contact Query');
    }
  },
  exportContact: async ({ contactIds, userId }: TProcessExportContact) => {
    try {
      const contacts = await Contacts.find(
        {
          userId,
          _id: { $in: contactIds },
        },
        {
          firstName: 1,
          lastName: 1,
          location: 1,
          phone: 1,
          email: 1,
          birthday: 1,
          worksAt: 1,
          _id: 0,
        }
      ).lean();
      return contacts;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown Error Occurred In Bulk Insert Contact Query');
    }
  },
  addLabelToContacts: async ({ labelUpdateTree, userId }: TAddLabel) => {
    try {
      const bulkOps = labelUpdateTree.map(({ contactId, labelIds }) => ({
        updateOne: {
          filter: { _id: contactId, userId },
          update: { $set: { labels: labelIds } },
        },
      }));
      await Contacts.bulkWrite(bulkOps);
      return;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(
        'Unknown Error Occurred In Bulk Add Label To Contact Query'
      );
    }
  },
  findContactsByLabel: async ({
    labelId,
    userId,
  }: {
    labelId: Types.ObjectId;
    userId: Types.ObjectId;
  }) => {
    try {
      const result = await Label.aggregate([
        { $match: { _id: new Types.ObjectId(labelId), createdBy: userId } }, // match label created by user
        {
          $lookup: {
            from: 'contacts', // MongoDB collection name
            let: { labelId: '$_id', creatorId: '$createdBy' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ['$$labelId', '$labels'] }, // contact has this label
                      { $eq: ['$userId', '$$creatorId'] }, // contact belongs to same user
                      { $eq: ['$isTrashed', false] }, // only non-trashed contacts
                    ],
                  },
                },
              },
            ],
            as: 'labelContacts',
          },
        },
        {
          $project: {
            _id: 1,
            labelName: 1, // label name
            labelContacts: 1, // contacts array
          },
        },
      ]);

      return (
        result[0] || { _id: labelId, name: '', color: '', labelContacts: [] }
      );
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(
        'Unknown Error Occurred In Bulk Add Label To Contact Query'
      );
    }
  },
};

export default ContactsRepositories;
