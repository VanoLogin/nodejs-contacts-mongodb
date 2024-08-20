import { Router } from 'express';
import express from 'express';

//============Schema====//
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/validationContacts.js';
//=============Middlewares================================//
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authUser } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';

//==============Utils================================//

import ctrlWrapper from '../utils/ctrlWrapper.js';

//=============Controller================================//

import {
  getContactsController,
  getContactsByIdController,
  createContactsController,
  deleteContactController,
  patchContactsByIdController,
} from '../controllers/contacts.js';

//============Routers====================//

const contactsRouter = Router();
const jsonParser = express.json();

contactsRouter.get(
  '/contacts',
  authUser,
  jsonParser,
  ctrlWrapper(getContactsController),
);

contactsRouter.get(
  '/contacts/:id',
  authUser,
  isValidId,
  ctrlWrapper(getContactsByIdController),
);

contactsRouter.post(
  '/contacts',
  authUser,
  jsonParser,
  upload.single('photo'),

  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);

contactsRouter.delete(
  '/contacts/:id',
  authUser,
  isValidId,
  jsonParser,

  ctrlWrapper(deleteContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  authUser,
  isValidId,
  jsonParser,
  upload.single('photo'),

  validateBody(updateContactSchema),
  ctrlWrapper(patchContactsByIdController),
);

export default contactsRouter;
