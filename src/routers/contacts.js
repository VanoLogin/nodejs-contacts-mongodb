import { Router } from 'express';
import express from 'express';

//============Schema====//
import {
  createContactSchema,
  updateContactSchema,
} from '../../validation/validationContacts.js';
//=============Middlewares================================//
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

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

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:id',
  isValidId,
  ctrlWrapper(getContactsByIdController),
);

contactsRouter.post(
  '/contacts',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);

contactsRouter.delete(
  '/contacts/:id',
  isValidId,
  jsonParser,
  ctrlWrapper(deleteContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactsByIdController),
);

export default contactsRouter;
