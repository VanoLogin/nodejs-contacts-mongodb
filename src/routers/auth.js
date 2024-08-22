import { Router } from 'express';
import express from 'express';

//==============Utils================================//

import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../validation/validationUser.js';
//==============controllers================================//

import {
  registerController,
  loginController,
  logoutUserController,
  refreshUserController,
  resetEmailController,
  resetPasswordController,
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

//=====================Refresh password =================//

userRouter.post(
  '/auth/send-reset-email',
  jsonParser,
  validateBody(resetEmailSchema),
  ctrlWrapper(resetEmailController),
);

userRouter.post(
  '/auth/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
export default userRouter;
