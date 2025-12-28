import { Authenticate, Authorize } from '@src/shared/middlewares/auth.js';
import { Router } from 'express';
import { createProfileController } from '../controllers/createProfileHandler.js';
import { updateProfileController } from '../controllers/updateProfileHandler.js';
import { updateAvatarController } from '../controllers/updateAvaterHandler.js';

export const userRoutes = Router();

/**
 * @swagger
 * /users/profile:
 *   post:
 *     summary: Create user profile
 *     description: Create a new user profile. Only available for CREATOR and FREELANCER roles.
 *     tags:
 *       - User Management
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "Experienced freelancer with 5 years in web development"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React", "Node.js"]
 *               portfolio:
 *                 type: string
 *                 example: "https://myportfolio.com"
 *               hourlyRate:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRoutes.post(
        '/createProfile',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        createProfileController.execute
);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile. Only available for CREATOR and FREELANCER roles.
 *     tags:
 *       - User Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
userRoutes.get('/profile', Authenticate, Authorize('CREATOR', 'FREELANCER'), createProfileController.execute);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information.
 *     tags:
 *       - User Management
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               portfolio:
 *                 type: string
 *               hourlyRate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRoutes.patch(
        '/profile',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        updateProfileController.execute
);

/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Update user avatar
 *     description: Upload and update the user's profile avatar image.
 *     tags:
 *       - User Management
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRoutes.patch('/avatar', Authenticate, Authorize('CREATOR', 'FREELANCER'), updateAvatarController.execute);
