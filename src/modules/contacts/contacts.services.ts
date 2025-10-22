import {
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
  TContactPayload,
  TImage,
  TProcessImportContact,
} from '@/modules/contacts/contacts.interfaces';
import ContactsRepositories from '@/modules/contacts/contacts.repositories';
import { join } from 'path';
import CloudinaryConfigs from '@/configs/cloudinary.configs';
import fs from 'fs/promises';
import {
  ExportContactFromVCard,
  ExtractContactsFromCsv,
  getFileExtension,
} from '@/utils/import.utils';

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
  bulkInsertContacts,
} = ContactsRepositories;

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
      const data = await findOneContact({ contactId });
      return data;
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
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown Error Occurred In Empty Trash Service');
    }
  },
  processFindContacts: async ({ userId }: IFindContactsPayload) => {
    try {
      const data = await findContacts({ userId });
      return data;
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
      const data = await findFavorites({ userId });
      return data;
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
      const data = await findTrash({ userId });
      return data;
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Recover One Trash');
      }
    }
  },
  processImportContact: async ({ fileName, userId }: TProcessImportContact) => {
    const filePath = join(__dirname, '../../../public/temp', fileName);
    const fileExtension = getFileExtension(fileName);
    try {
      const fileBuffer = await fs.readFile(filePath);
      const fileContent = fileBuffer.toString();
      let extractedContacts: TContactPayload[] = [];
      if (fileExtension === 'csv') {
        extractedContacts = ExtractContactsFromCsv({ fileContent, userId });
      }
      if (fileExtension === 'vcf') {
        extractedContacts = ExportContactFromVCard({ fileContent, userId });
      }
      const savedContacts = await bulkInsertContacts({
        contacts: extractedContacts,
      });
      await fs.unlink(filePath);
      return savedContacts;
    } catch (error) {
      await fs.unlink(filePath);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Import Service');
      }
    }
  },
};

export default ContactsServices;
