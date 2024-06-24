import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortedParams } from '../utils/parseSortedParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortedParams(req.query);
  const { isFavourite } = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    isFavourite,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

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
  const { body, file } = req;

  const contact = await createContact({ ...body, avatar: file }, req.user._id);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userId = req.user._id;

  const existedContact = await getContactById(contactId, userId);

  if (!existedContact) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  const result = await updateContact(contactId, req.body, userId, {
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
