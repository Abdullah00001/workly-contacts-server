import upload, { docsUpload } from '@/middlewares/multer.middleware';
import ContactsControllers from '@/modules/contacts/contacts.controllers';
import ContactsMiddlewares from '@/modules/contacts/contacts.middlewares';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const { checkAccessToken, checkSession } = UserMiddlewares;
const { checkImportFile, checkImportFileContents } = ContactsMiddlewares;
const {
  handleFindContacts,
  handleFindFavorites,
  handleFindTrash,
  handleCreateContact,
  handleChangeFavoriteStatus,
  handleFindOneContacts,
  handlePatchUpdateOneContact,
  handlePutUpdateOneContact,
  handleChangeTrashStatus,
  handleBulkChangeTrashStatus,
  handleDeleteManyContact,
  handleDeleteOneContact,
  handleSearchContact,
  handleBulkRecoverTrash,
  handleRecoverOneTrash,
  handleEmptyTrash,
  handleImportContact,
  handleExportContact,
  handleExportSingleContact,
  handleUpdateLabel,
  handleFindContactsByLabel,
} = ContactsControllers;

const router = Router();

router
  .route('/contacts/label')
  .patch(checkAccessToken, checkSession, handleUpdateLabel);

router
  .route('/contacts/recover')
  .patch(checkAccessToken, checkSession, handleBulkRecoverTrash);
router
  .route('/contacts/recover/:id')
  .patch(checkAccessToken, checkSession, handleRecoverOneTrash);
router
  .route('/contacts/empty')
  .delete(checkAccessToken, checkSession, handleEmptyTrash);
router
  .route('/contacts')
  .get(checkAccessToken, checkSession, handleFindContacts)
  .post(checkAccessToken, checkSession, handleCreateContact);
router
  .route('/search')
  .get(checkAccessToken, checkSession, handleSearchContact);
router
  .route('/contacts/:id')
  .get(checkAccessToken, checkSession, handleFindOneContacts)
  .put(
    checkAccessToken,
    checkSession,
    upload.single('avatarImage'),
    handlePutUpdateOneContact
  )
  .patch(checkAccessToken, checkSession, handlePatchUpdateOneContact);
router
  .route('/favorites')
  .get(checkAccessToken, checkSession, handleFindFavorites);
router
  .route('/favorites/:id')
  .patch(checkAccessToken, checkSession, handleChangeFavoriteStatus);
// get all trash item and add many in trash endpoint
router
  .route('/trash')
  .get(checkAccessToken, checkSession, handleFindTrash)
  .patch(checkAccessToken, checkSession, handleBulkChangeTrashStatus);
// single trash add endpoint
router
  .route('/trash/:id')
  .patch(checkAccessToken, checkSession, handleChangeTrashStatus);
router
  .route('/contacts/delete')
  .delete(checkAccessToken, checkSession, handleDeleteManyContact);
router
  .route('/contacts/delete/:id')
  .delete(checkAccessToken, checkSession, handleDeleteOneContact);

router
  .route('/contacts/import')
  .post(
    checkAccessToken,
    checkSession,
    docsUpload.single('docsFile'),
    checkImportFile,
    checkImportFileContents,
    handleImportContact
  );

router
  .route('/contacts/export')
  .post(checkAccessToken, checkSession, handleExportContact);

router
  .route('/contacts/export/:id')
  .get(checkAccessToken, checkSession, handleExportSingleContact);

router
  .route('/contacts/label/:id')
  .get(checkAccessToken, checkSession, handleFindContactsByLabel);

export default router;
