import mongoose from 'mongoose';
import { Contact } from '../db/modals/contacts.js';

async function getAllContacts() {
  try {
    const contacts = await Contact.find({});

    return contacts;
  } catch (error) {
    console.log(`Error getting Http to find all contacts: ${error}`);
  }
}

async function getContactById(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return;

    const contact = await Contact.findById(id);
    return contact;
  } catch (error) {
    console.log(`Error getting contact by id: ${error}`);
  }
}

async function createNewContact(contact) {
  try {
    const newContact = await Contact.create(contact);
    return newContact;
  } catch (error) {
    console.log(`Error creating contact by id: ${error}`);
  }
}
async function deleteContactById(id) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    return deletedContact;
  } catch (error) {
    console.log(`Error deleting contact by id not found: ${error}`);
  }
}

async function updateContact(id, contact, options = {}) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const rawResult = await Contact.findOneAndUpdate({ _id: id }, contact, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}

export {
  getContactById,
  getAllContacts,
  createNewContact,
  deleteContactById,
  updateContact,
};
