import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  upsertContactController,
} from '../controllers/contacts.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';

const routerContacts = Router();

routerContacts.get('/contacts', controllerWrapper(getContactsController));

routerContacts.get(
  '/contacts/:contactId',
  controllerWrapper(getContactByIdController),
);

routerContacts.post('/contacts', controllerWrapper(createContactController));

routerContacts.delete(
  '/contacts/:contactId',
  controllerWrapper(deleteContactController),
);

routerContacts.patch(
  '/contacts/:contactId',
  controllerWrapper(upsertContactController),
);

export default routerContacts;
