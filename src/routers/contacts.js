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

const routerContacts = Router();

routerContacts.use('/contacts/:contactId', validateMongoId('contactId'));

routerContacts.get('/contacts', controllerWrapper(getContactsController));

routerContacts.get(
  '/contacts/:contactId',
  controllerWrapper(getContactByIdController),
);

routerContacts.post(
  '/contacts',
  validateBody(createContactSchema),
  controllerWrapper(createContactController),
);

routerContacts.delete(
  '/contacts/:contactId',
  controllerWrapper(deleteContactController),
);

routerContacts.patch(
  '/contacts/:contactId',
  validateBody(updateContactSchema),
  controllerWrapper(upsertContactController),
);

export default routerContacts;
