import { Router } from 'express';
import { Authenticate } from '@src/shared/middlewares/auth.js';

import { createProfileHandler } from '../controllers/createProfileHandler.js';
import { getProfileHandler } from '../controllers/getProfileHandler.js';
import { updateAvatarHandler } from '../controllers/updateAvaterHandler.js';
import { updateProfileHandler } from '../controllers/updateProfileHandler.js';

export const userRoutes = Router();

/* ---------- USER PROFILE ROUTES ---------- */

userRoutes.post('/profile', Authenticate, createProfileHandler.Execute);

userRoutes.get('/profile/:id', Authenticate, getProfileHandler.Execute);

userRoutes.patch('/profile/:id', Authenticate, updateProfileHandler.Execute);

userRoutes.patch(
        '/profile/:id/avatar',
        Authenticate,
        updateAvatarHandler.Execute
);
