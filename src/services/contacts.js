import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';

const createPaginationInfo = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  let hasPreviousPage = page !== 1;
  const hasNextPage = page < totalPages;

  if (page > totalPages) {
    hasPreviousPage = false;
  }
  return {
    page: page,
    perPage: perPage,
    totalItems: count,
    totalPages: totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  isFavourite = false,
  userId,
}) => {
  const skip = perPage * (page - 1);

  const contactsQuery = Contact.find();
  if (isFavourite) {
    contactsQuery.where('isFavourite').equals(isFavourite);
  }
  contactsQuery.where('userId').equals(userId);

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    Contact.find()
      .merge(contactsQuery)
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      })
      .exec(),
  ]);
  const paginationInfo = createPaginationInfo(page, perPage, contactsCount);
  return {
    data: contacts,
    ...paginationInfo,
  };
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (payload, userId) => {
  const contact = await Contact.create({ ...payload, userId: userId });
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
