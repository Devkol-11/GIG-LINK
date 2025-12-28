import { Router } from 'express';
import { Authenticate, Authorize } from '@src/shared/middlewares/auth.js';

import { createGigController } from '../controllers/createGigController.js';
import { listGigsController } from '../controllers/listGigsController.js';
import { getGigController } from '../controllers/getGigController.js';
import { updateGigController } from '../controllers/updateGigController.js';
import { deleteGigController } from '../controllers/deleteGigController.js';

import { createApplicationController } from '../controllers/createApplicationController.js';
import { updateApplicationStatusController } from '../controllers/updateApplicationStatusController.js';
import { listApplicationsController } from '../controllers/listApplicationsController.js';

import { createContractController } from '../controllers/createContractController.js';
import { listContractsController } from '../controllers/listContractsController.js';
import { getContractController } from '../controllers/getContractController.js';

export const marketplaceRoutes = Router();

/**
 * @swagger
 * /marketplace/gigs:
 *   post:
 *     summary: Create a new gig
 *     description: Create a new gig/job post. Only CREATOR role can create gigs.
 *     tags:
 *       - Gigs
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Build a React Dashboard"
 *               description:
 *                 type: string
 *                 example: "Need a professional dashboard with charts and data visualization"
 *               price:
 *                 type: number
 *                 example: 5000
 *               category:
 *                 type: string
 *                 example: "Web Development"
 *               deliveryTime:
 *                 type: number
 *                 description: Delivery time in days
 *                 example: 7
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Gig created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gig:
 *                   $ref: '#/components/schemas/Gig'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
marketplaceRoutes.post('/gigs', Authenticate, Authorize('CREATOR'), createGigController.execute);

/**
 * @swagger
 * /marketplace/gigs:
 *   get:
 *     summary: List all gigs
 *     description: Retrieve a paginated list of all available gigs. Supports filtering and sorting.
 *     tags:
 *       - Gigs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by field
 *     responses:
 *       200:
 *         description: Gigs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gig'
 *                 pagination:
 *                   type: object
 */
marketplaceRoutes.get('/gigs', listGigsController.execute);

/**
 * @swagger
 * /marketplace/gigs/{id}:
 *   get:
 *     summary: Get gig details
 *     description: Retrieve detailed information about a specific gig.
 *     tags:
 *       - Gigs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gig ID
 *     responses:
 *       200:
 *         description: Gig details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gig'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
marketplaceRoutes.get('/gigs/:id', getGigController.execute);

/**
 * @swagger
 * /marketplace/gigs/{id}:
 *   patch:
 *     summary: Update gig
 *     description: Update gig details. Only the creator can update their gigs.
 *     tags:
 *       - Gigs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Gig updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gig'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
marketplaceRoutes.patch('/gigs/:id', Authenticate, Authorize('CREATOR'), updateGigController.execute);

/**
 * @swagger
 * /marketplace/gigs/{id}:
 *   delete:
 *     summary: Delete gig
 *     description: Delete a gig. Only the creator can delete their gigs.
 *     tags:
 *       - Gigs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gig deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
marketplaceRoutes.delete('/gigs/:id', Authenticate, Authorize('CREATOR'), deleteGigController.execute);

/**
 * @swagger
 * /marketplace/applications:
 *   post:
 *     summary: Create application for gig
 *     description: Apply for a gig as a freelancer. Only FREELANCER role can apply.
 *     tags:
 *       - Applications
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gigId
 *               - proposal
 *             properties:
 *               gigId:
 *                 type: string
 *               proposal:
 *                 type: string
 *                 description: Cover letter or proposal for the gig
 *               proposedPrice:
 *                 type: number
 *                 description: Optional custom price offer
 *               estimatedDays:
 *                 type: number
 *                 description: How many days to complete
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 application:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
marketplaceRoutes.post(
        '/applications',
        Authenticate,
        Authorize('FREELANCER'),
        createApplicationController.execute
);

/**
 * @swagger
 * /marketplace/applications:
 *   get:
 *     summary: List applications
 *     description: List all applications. Freelancers see their own, creators see applications to their gigs.
 *     tags:
 *       - Applications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: Applications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
marketplaceRoutes.get(
        '/applications',
        Authenticate,
        Authorize('FREELANCER', 'CREATOR'),
        listApplicationsController.execute
);

/**
 * @swagger
 * /marketplace/applications/{id}/{action}:
 *   patch:
 *     summary: Update application status
 *     description: Accept or reject an application. Only creator can update (for own gigs).
 *     tags:
 *       - Applications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [accept, reject]
 *     responses:
 *       200:
 *         description: Application updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
marketplaceRoutes.patch('/applications/:id/:action', Authenticate, updateApplicationStatusController.execute);

/**
 * @swagger
 * /marketplace/contracts:
 *   post:
 *     summary: Create contract
 *     description: Create a contract after accepting an application. Only CREATOR can create.
 *     tags:
 *       - Contracts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gigId
 *               - freelancerId
 *               - amount
 *             properties:
 *               gigId:
 *                 type: string
 *               freelancerId:
 *                 type: string
 *               amount:
 *                 type: number
 *               milestones:
 *                 type: array
 *                 description: Optional payment milestones
 *     responses:
 *       201:
 *         description: Contract created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 contract:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
marketplaceRoutes.post('/contracts', Authenticate, Authorize('CREATOR'), createContractController.execute);

/**
 * @swagger
 * /marketplace/contracts:
 *   get:
 *     summary: List contracts
 *     description: List all contracts for the authenticated user.
 *     tags:
 *       - Contracts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACTIVE, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Contracts retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
marketplaceRoutes.get(
        '/contracts',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        listContractsController.execute
);

/**
 * @swagger
 * /marketplace/contract:
 *   get:
 *     summary: Get contract details
 *     description: Retrieve detailed information about a specific contract.
 *     tags:
 *       - Contracts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contract details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contract:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
marketplaceRoutes.get(
        '/contract',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getContractController.execute
);
