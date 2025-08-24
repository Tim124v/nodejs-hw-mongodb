import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import { uploadImage } from '../services/upload.js';

export async function getContactsController(req, res) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    ...rawFilters
  } = req.query;

  const filters = { ...rawFilters };
  if (filters.type) {
    filters.contactType = filters.type;
    delete filters.type;
  }

  const result = await getAllContacts({ page, perPage, sortBy, sortOrder, ...filters, userId: req.user._id });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
}

export async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const data = { ...req.body, userId: req.user._id };
  if (req.file?.buffer) {
    const uploaded = await uploadImage(req.file.buffer);
    data.photo = uploaded.secure_url || uploaded.url;
  }
  const contact = await createContact(data);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  const { contactId } = req.params;
  const updateData = { ...req.body };
  if (req.file?.buffer) {
    const uploaded = await uploadImage(req.file.buffer);
    updateData.photo = uploaded.secure_url || uploaded.url;
  }
  const updatedContact = await updateContact(contactId, updateData, req.user._id);
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId, req.user._id);
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
} 