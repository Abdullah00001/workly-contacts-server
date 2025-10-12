import redisClient from '@/configs/redis.configs';
import { serverCacheExpiredIn } from '@/const';
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
  TImage,
} from '@/modules/contacts/contacts.interfaces';
import ContactsRepositories from '@/modules/contacts/contacts.repositories';
import CalculationUtils from '@/utils/calculation.utils';
import { join } from 'path';
import CloudinaryConfigs from '@/configs/cloudinary.configs';

const { upload, destroy } = CloudinaryConfigs;
const {
  findContacts,
  findFavorites,
  findTrash,
  createContact,
  changeFavoriteStatus,
  findOneContact,
  updateOneContact,
  changeTrashStatus,
  bulkChangeTrashStatus,
  deleteManyContact,
  deleteSingleContact,
  searchContact,
  bulkRecoverTrash,
  recoverOneTrash,
  emptyTrash,
} = ContactsRepositories;
const { expiresInTimeUnitToMs } = CalculationUtils;

const ContactsServices = {
  processCreateContacts: async ({
    avatar,
    email,
    firstName,
    birthday,
    lastName,
    phone,
    worksAt,
    location,
    userId,
  }: ICreateContactPayload) => {
    try {
      const data = await createContact({
        avatar,
        email,
        firstName,
        birthday,
        lastName,
        phone,
        worksAt,
        location,
        userId,
      });
      await redisClient.del(`contacts:${userId}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Create Contacts');
      }
    }
  },
  processFindOneContact: async ({
    contactId,
    userId,
  }: IFindOneContactPayload) => {
    try {
      const data = await redisClient.get(`contacts:${userId}:${contactId}`);
      if (!data) {
        const data = await findOneContact({ contactId });
        await redisClient.set(
          `contacts:${userId}:${contactId}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs(serverCacheExpiredIn)
        );
        return data;
      }
      return JSON.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find One Contacts');
      }
    }
  },
  processPatchUpdateOneContact: async ({
    contactId,
    avatar,
    birthday,
    email,
    firstName,
    lastName,
    location,
    phone,
    worksAt,
    userId,
  }: IUpdateOneContactPayload) => {
    try {
      const updatedAvatar = avatar as TImage;
      if (avatar?.url === null && avatar?.publicId) {
        await destroy(avatar?.publicId);
        updatedAvatar.publicId = null;
      }
      const data = await updateOneContact({
        contactId,
        avatar: updatedAvatar,
        birthday,
        email,
        firstName,
        lastName,
        location,
        phone,
        worksAt,
      });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        redisClient.del(`contacts:${userId}:${contactId}`),
      ]);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Update One Contacts'
        );
      }
    }
  },
  processPutUpdateOneContact: async ({
    contactId,
    avatar,
    avatarUpload,
    birthday,
    email,
    firstName,
    lastName,
    location,
    phone,
    worksAt,
    userId,
  }: IUpdateOneContactPayload) => {
    const filePath = join(
      __dirname,
      '../../../public/temp',
      avatarUpload as string
    );
    try {
      if (avatar?.publicId) {
        await destroy(avatar?.publicId);
      }
      const uploadedImage = await upload(filePath);
      if (!uploadedImage) throw new Error('Cloudinary Image Upload Failed');
      const data = await updateOneContact({
        contactId,
        avatar: uploadedImage,
        birthday,
        email,
        firstName,
        lastName,
        location,
        phone,
        worksAt,
      });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        redisClient.del(`contacts:${userId}:${contactId}`),
      ]);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Update One Contacts'
        );
      }
    }
  },
  processChangeFavoriteStatus: async ({
    contactId,
    isFavorite,
    userId,
  }: IChangeFavoriteStatusPayload) => {
    try {
      const data = await changeFavoriteStatus({ contactId, isFavorite });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        redisClient.del(`contacts:${userId}:${contactId}`),
        redisClient.del(`favorites:${userId}`),
      ]);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Change Contacts Favorite Status'
        );
      }
    }
  },
  processChangeTrashStatus: async ({
    contactId,
    userId,
  }: IChangeTrashStatusPayload) => {
    try {
      const data = await changeTrashStatus({ contactId });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        redisClient.del(`contacts:${userId}:${contactId}`),
        redisClient.del(`trash:${userId}`),
        redisClient.del(`favorites:${userId}`),
      ]);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Change Contacts Trash Status'
        );
      }
    }
  },
  processBulkChangeTrashStatus: async ({
    contactIds,
    userId,
  }: IBulkChangeTrashStatusPayload) => {
    try {
      await bulkChangeTrashStatus({ contactIds });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        ...contactIds!.map((contactId) =>
          redisClient.del(`contacts:${userId}:${contactId}`)
        ),
        redisClient.del(`trash:${userId}`),
        redisClient.del(`favorites:${userId}`),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Bulk Change Contacts Trash Status'
        );
      }
    }
  },
  processDeleteSingleContact: async ({
    contactId,
    userId,
  }: IDeleteSingleContactPayload) => {
    try {
      const isDeleted = await deleteSingleContact({ contactId });
      if (!isDeleted) return null;
      await destroy(isDeleted.avatar.publicId);
      await redisClient.del(`trash:${userId}`);
      return isDeleted;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Delete Single Contacts'
        );
      }
    }
  },
  processDeleteManyContact: async ({
    contactIds,
    userId,
  }: IDeleteManyContactPayload) => {
    try {
      const { deletedContactCount, deletedContacts } = await deleteManyContact({
        contactIds,
      });
      if (!deletedContactCount && deletedContacts.length === 0) return null;
      const publicIds = deletedContacts
        .map((item) => item.avatar?.publicId)
        .filter(Boolean);
      await Promise.all([
        redisClient.del(`trash:${userId}`),
        ...publicIds.map(async (item) => await destroy(item)),
      ]);
      return { deletedContactCount, deletedContacts };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Delete Many Contacts'
        );
      }
    }
  },
  processEmptyTrash: async ({ userId }: IDeleteManyContactPayload) => {
    try {
      const { contacts, deletedCount } = await emptyTrash({ userId });
      if (!deletedCount && contacts.length === 0)
        throw new Error('Empty Trash Operation Failed');
      const publicIds = contacts
        .map((item) => item.avatar?.publicId)
        .filter(Boolean);
      await Promise.all([
        redisClient.del(`trash:${userId}`),
        ...publicIds.map(async (item) => await destroy(item)),
      ]);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown Error Occurred In Empty Trash Service');
    }
  },
  processFindContacts: async ({ userId }: IFindContactsPayload) => {
    try {
      const cachedContacts = await redisClient.get(`contacts:${userId}`);
      if (!cachedContacts) {
        const data = await findContacts({ userId });
        await redisClient.set(
          `contacts:${userId}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs(serverCacheExpiredIn)
        );
        return data;
      }
      return JSON.parse(cachedContacts);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find Contacts');
      }
    }
  },
  processFindFavorites: async ({ userId }: IFindContactsPayload) => {
    try {
      const cachedFavorites = await redisClient.get(`favorites:${userId}`);
      if (!cachedFavorites) {
        const data = await findFavorites({ userId });
        await redisClient.set(
          `favorites:${userId}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs(serverCacheExpiredIn)
        );
        return data;
      }
      return JSON.parse(cachedFavorites);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find Favorites');
      }
    }
  },
  processFindTrash: async ({ userId }: IFindContactsPayload) => {
    try {
      const cachedTrash = await redisClient.get(`trash:${userId}`);
      if (!cachedTrash) {
        const data = await findTrash({ userId });
        await redisClient.set(
          `trash:${userId}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs(serverCacheExpiredIn)
        );
        return data;
      }
      return JSON.parse(cachedTrash);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find Trash');
      }
    }
  },
  processSearchContact: async ({ query, userId }: ISearchContact) => {
    const regex = new RegExp(query, 'i');
    try {
      const cachedContacts = await redisClient.get(`contacts:${userId}`);
      if (cachedContacts) {
        const contacts: IContacts[] = JSON.parse(cachedContacts);
        const filtered = contacts.filter((contact) =>
          [contact.name, contact.email, contact.phone].some((field) =>
            regex.test(field)
          )
        );
        return filtered;
      }
      return await searchContact({ query, userId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Search Contact');
      }
    }
  },
  processBulkRecoverTrash: async ({
    contactIds,
    userId,
  }: IBulkChangeTrashStatusPayload) => {
    try {
      await bulkRecoverTrash({ contactIds });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        redisClient.del(`trash:${userId}`),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Bulk Recover Trash');
      }
    }
  },
  processRecoverOneTrash: async ({
    contactId,
    userId,
  }: IChangeTrashStatusPayload) => {
    try {
      await recoverOneTrash({ contactId });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        redisClient.del(`trash:${userId}`),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Recover One Trash');
      }
    }
  },
};

export default ContactsServices;
