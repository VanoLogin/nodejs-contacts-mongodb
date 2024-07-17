import mongoose from 'mongoose';
import { Contact } from '../db/modals/contacts.js';

async function getAllContacts() {
  try {
    const contacts = await Contact.find({});
    console.log('\n\n\n\n');
    console.log(Contact);
    console.log(contacts);
    console.log('\n\n\n\n');

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
export { getContactById, getAllContacts };
