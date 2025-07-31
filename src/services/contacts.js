import { Contact } from '../db/contactModel.js';

export async function getAllContacts() {
  return await Contact.find();
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