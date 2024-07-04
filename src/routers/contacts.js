import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  upsertContactController,
} from '../controllers/contacts.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
import { convertBoolean } from '../middlewares/convertBoolean.js';

const routerContacts = Router();

routerContacts.use(authenticate);

routerContacts.use('/:contactId', validateMongoId('contactId'));

routerContacts.get('/', controllerWrapper(getContactsController));

routerContacts.get('/:contactId', controllerWrapper(getContactByIdController));

routerContacts.post(
  '/',
  upload.single('photo'),
  convertBoolean,
  validateBody(createContactSchema),
  authenticate,
  controllerWrapper(createContactController),
);

routerContacts.delete(
  '/:contactId',
  authenticate,
  controllerWrapper(deleteContactController),
);

routerContacts.patch(
  '/:contactId',
  upload.single('photo'),
  convertBoolean,
  authenticate,
  validateBody(updateContactSchema),
  controllerWrapper(upsertContactController),
);

export default routerContacts;
