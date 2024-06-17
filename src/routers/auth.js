import { Router } from 'express';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/register.js';
import {
  loginUserController,
  logoutController,
  refreshTokenController,
  registerUserController,
} from '../controllers/auth.js';

const routerAuth = Router();

routerAuth.post(
  '/register',
  validateBody(registerUserSchema),
  controllerWrapper(registerUserController),
);
routerAuth.post(
  '/login',
  validateBody(loginUserSchema),
  controllerWrapper(loginUserController),
);
routerAuth.post('/refresh', controllerWrapper(refreshTokenController));
routerAuth.post('/logout', controllerWrapper(logoutController));

export default routerAuth;
