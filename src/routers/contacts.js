import { Router } from 'express';
import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';

import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { upload } from '../middlewares/multer.js';

const contactsRouter = Router();
const jsonParser = express.json();
contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));


contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);


contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController));

contactsRouter.post(
  '/',
  jsonParser,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);


contactsRouter.patch(
  '/:contactId',
  jsonParser,
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
export default contactsRouter;
