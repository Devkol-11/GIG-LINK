import { Router } from 'express';

import { registerFreeLancerController } from '../controllers/RegisterFreeLancerController.js';
import { registerCreatorController } from '../controllers/RegisterCreatorController.js';
import { loginController } from '../controllers/LoginContoller.js';
import { forgotPasswordController } from '../controllers/ForgotPasswordController.js';
import { resetPasswordController } from '../controllers/ResetPasswordController.js';

import { validateRequest } from '@src/contexts/User/http/middle-wares/validateRequest.js';
import { interceptRequiredFields } from '../middle-wares/require.fields.js';
import { registerSchema, loginSchema } from '../middle-wares/authSchemas.js';

export const authRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *
 * /auth/check:
 *   get:
 *     summary: Health check for auth service
 *     description: Verify that the authentication service is running
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
authRoutes.get('/check', (_req, res) => {
        res.status(200).json({
                message: 'Auth router working'
        });
});

/**
 * @swagger
 * /auth/register/free-lancer:
 *   post:
 *     summary: Register a new freelancer
 *     description: Create a new freelancer account. Freelancers can apply for gigs created by creators.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: freelancer@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: SecurePass123!
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       201:
 *         description: Freelancer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Email already registered
 */
authRoutes.post(
        '/register/free-lancer',
        interceptRequiredFields,
        validateRequest(registerSchema),
        registerFreeLancerController.execute
);

/**
 * @swagger
 * /auth/register/creator:
 *   post:
 *     summary: Register a new creator
 *     description: Create a new creator account. Creators can create gigs and hire freelancers.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: creator@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: SecurePass123!
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *     responses:
 *       201:
 *         description: Creator registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Email already registered
 */
authRoutes.post(
        '/register/creator',
        interceptRequiredFields,
        validateRequest(registerSchema),
        registerCreatorController.execute
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with email and password. Returns access and refresh tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       401:
 *         description: Invalid credentials
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
authRoutes.post('/login', validateRequest(loginSchema), loginController.execute);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Send OTP to user's email for password reset. User must provide only email address.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent, please check your mail
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
authRoutes.post('/forgot-password', forgotPasswordController.execute);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     description: Reset user password using OTP received via email. OTP must be valid and not expired.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: NewPass123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
authRoutes.post('/reset-password', resetPasswordController.execute);
