import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rowResult = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rowResult || !rowResult.value) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact: rowResult.value,
    isNew: rowResult?.lastErrorObject?.upserted,
  };
};
