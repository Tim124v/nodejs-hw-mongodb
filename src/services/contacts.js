import { Contact } from '../db/contactModel.js';

export async function getAllContacts(queryParams) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    ...filters
  } = queryParams;

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Преобразуем строки 'true'/'false' в boolean
  Object.keys(filters).forEach(key => {
    if (filters[key] === 'true') filters[key] = true;
    if (filters[key] === 'false') filters[key] = false;
  });

  const total = await Contact.countDocuments(filters);
  const contacts = await Contact.find(filters)
    .sort(sort)
    .skip(Number(skip))
    .limit(Number(perPage));

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    total,
    totalPages,
    hasNextPage: Number(page) < totalPages,
    hasPrevPage: Number(page) > 1
  };
}

export async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

export async function createContact(contactData) {
  return await Contact.create(contactData);
}

export async function updateContact(contactId, updateData) {
  return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
}

export async function deleteContact(contactId) {
  return await Contact.findByIdAndDelete(contactId);
} 