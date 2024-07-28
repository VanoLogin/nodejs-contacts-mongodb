import {
  getAllContacts,
  getContactById,
  createNewContact,
  deleteContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { notFoundHandler } from '../middlewares/notFoundHandler.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const getContactsByIdController = async (req, res, next) => {
  const { id } = req.params;

  const contact = await getContactById(id);

  if (!contact) {
    return next(createHttpError(notFoundHandler));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

async function createContactsController(req, res) {
  const newContact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };

  const createdContact = await createNewContact(newContact);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: { ...createdContact.toObject(), __v: false },
  });
}
async function deleteContactController(req, res, next) {
  const { id } = req.params;
  const contact = await deleteContactById(id);

  if (!contact) {
    next(createHttpError(errorHandler));
    return;
  }
  res.status(204).send();
}
async function patchContactsByIdController(req, res, next) {
  const { id } = req.params;
  const result = await updateContact(id, req.body);
  if (!result) {
    next(createHttpError(errorHandler));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
}

export {
  getContactsController,
  getContactsByIdController,
  createContactsController,
  deleteContactController,
  patchContactsByIdController,
};
