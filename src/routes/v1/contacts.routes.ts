import upload from '@/middlewares/multer.middleware';
import ContactsControllers from '@/modules/contacts/contacts.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const { checkAccessToken,checkSession } = UserMiddlewares;
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
} = ContactsControllers;

const router = Router();

router
  .route('/contacts/recover')
  .patch(checkAccessToken, handleBulkRecoverTrash);
router
  .route('/contacts/recover/:id')
  .patch(checkAccessToken, handleRecoverOneTrash);
router.route('/contacts/empty').delete(checkAccessToken, handleEmptyTrash);
router
  .route('/contacts')
  .get(checkAccessToken,checkSession, handleFindContacts)
  .post(checkAccessToken, handleCreateContact);
router.route('/search').get(checkAccessToken, handleSearchContact);
router
  .route('/contacts/:id')
  .get(checkAccessToken, handleFindOneContacts)
  .put(
    checkAccessToken,
    upload.single('avatarImage'),
    handlePutUpdateOneContact
  )
  .patch(checkAccessToken, handlePatchUpdateOneContact);
router.route('/favorites').get(checkAccessToken, handleFindFavorites);
router
  .route('/favorites/:id')
  .patch(checkAccessToken, handleChangeFavoriteStatus);
router
  .route('/trash')
  .get(checkAccessToken, handleFindTrash)
  .patch(checkAccessToken, handleBulkChangeTrashStatus);
router.route('/trash/:id').patch(checkAccessToken, handleChangeTrashStatus);
router
  .route('/contacts/delete')
  .delete(checkAccessToken, handleDeleteManyContact);
router
  .route('/contacts/delete/:id')
  .delete(checkAccessToken, handleDeleteOneContact);

export default router;
