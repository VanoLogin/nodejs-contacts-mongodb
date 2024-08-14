import { Router } from 'express';
import express from 'express';

//==============Utils================================//

import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validation/validationUser.js';
//==============controllers================================//

import {
  registerController,
  loginController,
  logoutUserController,
  refreshUserController,
} from '../controllers/auth.js';

const userRouter = Router();
const jsonParser = express.json();

userRouter.post(
  '/auth/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerController),
);

userRouter.post(
  '/auth/login',
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginController),
);
userRouter.post('/auth/logout', ctrlWrapper(logoutUserController));
userRouter.post('/auth/refresh', ctrlWrapper(refreshUserController));

export default userRouter;
