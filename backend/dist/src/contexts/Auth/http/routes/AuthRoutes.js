'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.authRoutes = void 0;
const express_1 = require('express');
const validateRequest_1 = require('@src/shared/middlewares/validateRequest');
const authValidators_1 = require('../middle-wares/authValidators');
//IMPORT INSTANCES
const RegisterController_1 = require('../controllers/RegisterController');
const LoginContoller_1 = require('../controllers/LoginContoller');
const ForgotPasswordController_1 = require('../controllers/ForgotPasswordController');
const ResetPasswordController_1 = require('../controllers/ResetPasswordController');
const createAuthRoutes = (
        registerController,
        loginController,
        forgotPasswordController,
        resetPasswordController
) => {
        const authRouter = (0, express_1.Router)();
        authRouter.get('/check', (req, res, next) => {
                res.status(200).json({
                        message: 'Auth router working'
                });
        });
        authRouter.post(
                '/register',
                (0, validateRequest_1.validateRequest)(
                        authValidators_1.registerSchema
                ),
                (req, res, next) => registerController.Execute(req, res, next)
        );
        authRouter.post(
                '/login',
                (0, validateRequest_1.validateRequest)(
                        authValidators_1.loginSchema
                ),
                (req, res, next) => loginController.Execute(req, res, next)
        );
        authRouter.post('/forgot-password', (req, res, next) =>
                forgotPasswordController.Execute(req, res, next)
        );
        authRouter.post('/reset-password', (req, res, next) =>
                resetPasswordController.Execute(req, res, next)
        );
        return authRouter;
};
exports.authRoutes = createAuthRoutes(
        RegisterController_1.registerController,
        LoginContoller_1.loginController,
        ForgotPasswordController_1.forgotPasswordController,
        ResetPasswordController_1.resetPasswordController
);
