import {
  getAllContacts,
  getContactById,
  createNewContact,
  deleteContactById,
  updateContact,
} from '../services/contacts.js';

//==========================UTILS=========//
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
//==========================//
import { CLOUDINARY } from '../constants/index.js';

import createHttpError from 'http-errors';

//==============getContactsController============//

const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    console.log(req.user._id);
    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });

    if (!contacts.data || !contacts.data.length) {
      res.status(404).json({
        status: 404,
        message: 'Contacts not found',
        data: [],
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(createHttpError(error));
  }
};

//================getContactsByIdController======================//

// const getContactsByIdController = async (req, res, next) => {
//   const { id } = req.params;
//   console.log(req.user._id);
//   const contact = await getContactById(id);
//   console.log(contact);
//   if (
//     contact === null ||
//     contact.userId.toString() !== req.user._id.toString()
//   ) {
//     return next(createHttpError(404, 'Contact not found'));
//   }

//   res.status(200).json({
//     status: 200,
//     message: `Successfully found contact with id ${id}!`,
//     data: contact,
//   });
// };
const getContactsByIdController = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id, req.user._id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};
//=====================createContactsController=================//

async function createContactsController(req, res) {
  const photo = req.file;
  const imageUrl = photo ? await saveFileToCloudinary(photo) : '';

  const newContact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user._id,
    ...(imageUrl && { photo: imageUrl }),
  };
  const createdContact = await createNewContact(newContact);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact.toObject(),
  });
}

//====================deleteContactController==================//

async function deleteContactController(req, res, next) {
  const { id } = req.params;
  const contact = await deleteContactById(id, req.user._id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).send();
}

//=======================patchContactsByIdController===============//

// async function patchContactsByIdController(req, res, next) {
//   const { id } = req.params;
//   const photo = req.file;
//   console.log(photo);
//   const result = await updateContact(id, req.user._id, req.body);

//   if (!result) {
//     next(createHttpError(404, 'Contact not found'));
//     return;
//   }
//   res.json({
//     status: 200,
//     message: `Successfully patched a contact!`,
//     data: result.contact,
//   });
// }
const patchContactsByIdController = async (req, res, next) => {
  const { id } = req.params;
  const photo = req.file;
  console.log(photo);
  let photoUrl;
  if (photo) {
    if (CLOUDINARY.ENABLE_CLOUDINARY === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(id, req.user._id, {
    ...req.body,
    photo: photoUrl,
  });
  console.log(result);
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: { ...result.contact.toObject(), __v: undefined },
  });
};

//======================================//

export {
  getContactsController,
  getContactsByIdController,
  createContactsController,
  deleteContactController,
  patchContactsByIdController,
};

//1724159804289_20240425_DSF9791
//1724159804289_20240425_DSF9791
