import { Router } from 'express';
import {
        RegisterController,
        registerController
} from '../controllers/RegisterController.js';
import {
        LoginController,
        loginController
} from '../controllers/LoginContoller.js';
import {
        googleAuthController,
        GoogleAuthController
} from '../controllers/GoogleAuthController.js';
import {
        ForgotPasswordController,
        forgotPasswordController
} from '../controllers/ForgotPasswordController.js';
import {
        ResetPasswordController,
        resetPasswordController
} from '../controllers/ResetPasswordController.js';
import { validateRequest } from '@src/contexts/Auth/http/middle-wares/validateRequest.js';
import { registerSchema, loginSchema } from '../middle-wares/authValidators.js';

const createAuthRoutes = (
        registerHandler: RegisterController,
        loginHandler: LoginController,
        googleAuthHandler: GoogleAuthController,
        forgotPasswordHandler: ForgotPasswordController,
        resetPasswordHandler: ResetPasswordController
): Router => {
        const authRouter = Router();

        authRouter.get('/check', (_req, res, _next) => {
                res.status(200).json({
                        message: 'Auth router working'
                });
        });

        authRouter.post(
                '/register',
                validateRequest(registerSchema),
                registerHandler.Execute
        );

        authRouter.post(
                '/login',
                validateRequest(loginSchema),
                loginHandler.Execute
        );

        authRouter.post('/google', googleAuthHandler.Execute);

        authRouter.post('/forgot-password', forgotPasswordHandler.Execute);

        authRouter.post('/reset-password', resetPasswordHandler.Execute);
        return authRouter;
};

export const authRoutes = createAuthRoutes(
        registerController,
        loginController,
        googleAuthController,
        forgotPasswordController,
        resetPasswordController
);
