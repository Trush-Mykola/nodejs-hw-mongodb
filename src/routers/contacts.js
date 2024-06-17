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

const routerContacts = Router();

routerContacts.use('/:contactId', validateMongoId('contactId'));

routerContacts.get('/', authenticate);

routerContacts.get('/', controllerWrapper(getContactsController));

routerContacts.get('/:contactId', controllerWrapper(getContactByIdController));

routerContacts.post(
  '/',
  validateBody(createContactSchema),
  controllerWrapper(createContactController),
);

routerContacts.delete(
  '/:contactId',
  controllerWrapper(deleteContactController),
);

routerContacts.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  controllerWrapper(upsertContactController),
);

export default routerContacts;
