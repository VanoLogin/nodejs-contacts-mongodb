import { Router } from 'express';
import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactsByIdController,
  createContactsController,
  deleteContactController,
  patchContactsByIdController,
} from '../controllers/contacts.js';

const contactsRouter = Router();
const jsonParser = express.json();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:id', ctrlWrapper(getContactsByIdController));

contactsRouter.post(
  '/contacts',
  jsonParser,
  ctrlWrapper(createContactsController),
);

contactsRouter.delete(
  '/contacts/:id',
  jsonParser,
  ctrlWrapper(deleteContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  jsonParser,
  ctrlWrapper(patchContactsByIdController),
);

export default contactsRouter;
