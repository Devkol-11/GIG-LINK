import { Router } from 'express';

import { registerFreeLancerController } from '../controllers/RegisterFreeLancerController.js';
import { registerCreatorController } from '../controllers/RegisterCreatorController.js';
import { loginController } from '../controllers/LoginContoller.js';
import { googleAuthController } from '../controllers/GoogleAuthController.js';
import { forgotPasswordController } from '../controllers/ForgotPasswordController.js';
import { resetPasswordController } from '../controllers/ResetPasswordController.js';

import { validateRequest } from '@src/contexts/Auth/http/middle-wares/validateRequest.js';
import { interceptRequiredFields } from '../middle-wares/require.fields.js';
import { registerSchema, loginSchema } from '../middle-wares/authSchemas.js';

export const authRoutes = Router();

// health check
authRoutes.get('/check', (_req, res) => {
        res.status(200).json({
                message: 'Auth router working'
        });
});

// registration routes
authRoutes.post(
        '/register/free-lancer',
        interceptRequiredFields,
        validateRequest(registerSchema),
        registerFreeLancerController.Execute
);

authRoutes.post(
        '/register/creator',
        interceptRequiredFields,
        validateRequest(registerSchema),
        registerCreatorController.Execute
);

// login
authRoutes.post(
        '/login',
        validateRequest(loginSchema),
        loginController.Execute
);

// Google OAuth
authRoutes.post('/google', googleAuthController.Execute);

// password flows
authRoutes.post('/forgot-password', forgotPasswordController.Execute);
authRoutes.post('/reset-password', resetPasswordController.Execute);
