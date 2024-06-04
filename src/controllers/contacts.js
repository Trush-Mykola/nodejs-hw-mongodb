import mongoose from 'mongoose';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    next(createHttpError(400, 'Invalid id format'));
    return;
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    next(createHttpError(404, "Contact with this id doesn't exist"));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const body = req.body;
  const contact = await createContact(body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const contactId = req.params.contactId;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    next(createHttpError(400, 'Invalid id format'));
    return;
  }

  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const contactId = req.params.contactId;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    next(createHttpError(400, 'Invalid id format'));
    return;
  }

  const existedContact = await getContactById(contactId);

  if (!existedContact) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  const result = await updateContact(contactId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
