import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';
import { saveToClaudinary } from '../utils/saveToClaudinary.js';

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

  const contactsQuery = Contact.findOne({ userId });

  if (isFavourite) {
    contactsQuery.where('isFavourite').equals(isFavourite);
  }

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

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const createContact = async ({ photo, ...payload }, userId) => {
  let url;
  // const url = await saveFileToUploadDir(avatar);
  // const url = await saveToClaudinary(avatar);
  if (photo) {
    url = await saveToClaudinary(photo);
  }
  const contact = await Contact.create({
    ...payload,
    userId: userId,
    photo: url,
  });
  return contact;
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};

// export const updateContact = async (
//   contactId,
//   { avatar, ...payload },
//   userId,
//   options = {},
// ) => {
//   const url = await saveToClaudinary(avatar);

//   const rowResult = await Contact.findOneAndUpdate(
//     { _id: contactId, userId: userId },
//     { ...payload, photo: url },
//     {
//       new: true,
//       includeResultMetadata: true,
//       ...options,
//     },
//   );

//   if (!rowResult || !rowResult.value) {
//     throw createHttpError(404, 'Contact not found');
//   }

//   return {
//     contact: rowResult.value,
//     isNew: rowResult?.lastErrorObject?.upserted,
//   };
// };

export const updateContact = async (
  contactId,
  { photo, ...payload },
  userId,
  options = {},
) => {
  let url;

  if (photo) {
    url = await saveToClaudinary(photo);
  }

  const rowResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId: userId },
    { ...payload, photo: url },
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rowResult || !rowResult.value) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact: rowResult.value,
    isNew: rowResult?.lastErrorObject?.upserted,
  };
};
