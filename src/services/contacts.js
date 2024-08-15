// import mongoose from 'mongoose';
import { Contact } from '../db/modals/contacts.js';

async function getAllContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
  userId,
}) {
  const { type, isFavourite } = filter;
  const skip = page > 0 ? (page - 1) * perPage : 0;
  try {
    let contactsQuery = Contact.find({ userId });

    if (type) {
      contactsQuery.where('contactType').equals(type);
    }
    if (isFavourite === true || isFavourite === false) {
      contactsQuery.where('isFavourite').equals(isFavourite);
    }

    const countQuery = contactsQuery.clone();

    const contactsCount = await countQuery.countDocuments();

    const contacts = await contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage)
      .exec();

    const totalPages = Math.ceil(contactsCount / perPage);

    if (page > totalPages) {
      page = totalPages;
    } else if (page <= 0) {
      page = 1;
    }

    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      data: contacts,
      page,
      perPage,
      totalItems: contactsCount,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  } catch (error) {
    console.log(`Error getting contacts: ${error.message}`);
  }
}

// async function getContactById(studentId) {
//   try {
//     const contact = await Contact.findOne({
//       _id: studentId,
//     });
//     return contact;
//   } catch (error) {
//     console.log(`Error getting contact by id: ${error}`);
//   }
// }
async function getContactById(contactId, userId) {
  try {
    const contact = await Contact.findOne({
      _id: contactId,
      userId: userId,
    });
    return contact;
  } catch (error) {
    console.log(`Error getting contact by id: ${error}`);
  }
}

// const getContactById = async (id, userId) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return null;
//     }
//     const contact = await Contact.findOne({ id, userId });
//     return contact;
//   } catch (error) {
//     console.error('Error getting contact by ID:', error);
//     throw error;
//   }
// };

async function createNewContact(contact) {
  try {
    const newContact = await Contact.create(contact);
    return newContact;
  } catch (error) {
    console.log(`Error creating contact by id: ${error}`);
  }
}
async function deleteContactById(id, userId) {
  try {
    const deletedContact = await Contact.findByIdAndDelete({
      _id: id,
      userId: userId,
    });
    return deletedContact;
  } catch (error) {
    console.log(`Error deleting contact by id not found: ${error}`);
  }
}

async function updateContact(id, userId, contact, options = {}) {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: id, userId },
    contact,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

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
