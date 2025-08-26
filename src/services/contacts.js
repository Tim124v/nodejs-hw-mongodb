import { Contact } from '../db/contactModel.js';

export async function getAllContacts(queryParams) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    ...filters
  } = queryParams;

  Object.keys(filters).forEach(key => {
    if (filters[key] === undefined) {
      delete filters[key];
    }
    if (filters[key] === 'true') filters[key] = true;
    if (filters[key] === 'false') filters[key] = false;
  });

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const total = await Contact.countDocuments(filters);
  const contacts = await Contact.find(filters)
    .sort(sort)
    .skip(Number(skip))
    .limit(Number(perPage));

  const totalPages = Math.ceil(total / Number(perPage));

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems: total,
    totalPages,
    hasPreviousPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages
  };
}

export async function getContactById(contactId, userId) {
  return await Contact.findOne({ _id: contactId, userId });
}

export async function createContact(contactData) {
  return await Contact.create(contactData);
}

export async function updateContact(contactId, updateData, userId) {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, updateData, { new: true });
}

export async function deleteContact(contactId, userId) {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
} 