import { Router } from 'express';
import routerContacts from './contacts.js';
import routerAuth from './auth.js';

const rootRouter = Router();

rootRouter.use('/contacts', routerContacts);
rootRouter.use('/auth', routerAuth);

export default rootRouter;
