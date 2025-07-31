import { getAllContacts } from '../services/contacts.js';
import { getContactById } from '../services/contacts.js';
import { createContact } from '../services/contacts.js';
import { updateContact } from '../services/contacts.js';
import { deleteContact } from '../services/contacts.js';
import createError from 'http-errors';

export async function getContactsController(req, res) {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
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
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);
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
  const deletedContact = await deleteContact(contactId);
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
} 