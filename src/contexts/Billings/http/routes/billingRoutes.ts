import { Router } from 'express';
import express from 'express';

import { Authenticate, Authorize } from '@src/shared/middlewares/auth.js';
import { verifyWebhookSignature } from '../middlewares/verifyWebhookSignature.js';
import { captureRawBody } from '../middlewares/captureRawBody.js';

import { paymentRequestController } from '../controllers/paymentRequestController.js';
import { verifyPaymentStatusController } from '../controllers/verifyPaymentStatusController.js';
import { verifyPaymentWebhookController } from '../controllers/verifyPaymentWebhook.js';
import { withdrawalRequestController } from '../controllers/withdrawalRequestController.js';
import { verifyWithdrawalWebhookController } from '../controllers/verifyWithdrawalWebhookController.js';
import { listWalletPaymentController } from '../controllers/listWalletPaymentsController.js';
import { fundEscrowAccountController } from '../controllers/fundEscrowController.js';
import { releaseEscrowController } from '../controllers/releaseEscrowController.js';
import { getEscrowAccountTransactionController } from '../controllers/getEscrowTransactionController.js';

const billingRoutes = Router();

/**
 * @swagger
 * /billing/payments:
 *   post:
 *     summary: Initiate payment to fund wallet
 *     description: Create a payment request to fund user's wallet. Integrates with Paystack for processing.
 *     tags:
 *       - Billing & Payments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               paymentMethod:
 *                 type: string
 *                 enum: [CARD, BANK_TRANSFER]
 *                 example: CARD
 *     responses:
 *       201:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *                 authorizationUrl:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
billingRoutes.post(
        '/payments',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        paymentRequestController.execute
);

/**
 * @swagger
 * /billing/payments/{paymentId}/verify:
 *   get:
 *     summary: Verify payment status
 *     description: Check the current status of a payment. Client-triggered verification.
 *     tags:
 *       - Billing & Payments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID to verify
 *     responses:
 *       200:
 *         description: Payment status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [PENDING, SUCCESS, FAILED]
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
billingRoutes.get(
        '/payments/:paymentId/verify',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        verifyPaymentStatusController.execute
);

/**
 * @swagger
 * /billing/webhooks/payments:
 *   post:
 *     summary: Payment webhook endpoint
 *     description: Webhook endpoint for payment provider (Paystack) to notify of payment status. Not for client use.
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       401:
 *         description: Invalid webhook signature
 */
billingRoutes.post(
        '/webhooks/payments',
        captureRawBody,
        verifyWebhookSignature,
        express.json(),
        verifyPaymentWebhookController.execute
);

/**
 * @swagger
 * /billing/withdrawals:
 *   post:
 *     summary: Request withdrawal
 *     description: Submit a withdrawal request to transfer wallet balance to bank account.
 *     tags:
 *       - Withdrawals
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - bankAccountId
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 2000
 *               bankAccountId:
 *                 type: string
 *                 description: User's verified bank account ID
 *     responses:
 *       201:
 *         description: Withdrawal request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 withdrawal:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
billingRoutes.post(
        '/withdrawals',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        withdrawalRequestController.execute
);

/**
 * @swagger
 * /billing/webhooks/withdrawals:
 *   post:
 *     summary: Withdrawal webhook endpoint
 *     description: Webhook endpoint for withdrawal provider to notify of withdrawal status.
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */
billingRoutes.post(
        '/webhooks/withdrawals',
        captureRawBody,
        verifyWebhookSignature,
        express.json(),
        verifyWithdrawalWebhookController.execute
);

/**
 * @swagger
 * /billing/wallets/me/payments:
 *   get:
 *     summary: List wallet payment history
 *     description: Retrieve the authenticated user's wallet payment history.
 *     tags:
 *       - Wallets
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Records per page
 *     responses:
 *       200:
 *         description: Payment history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *                 pagination:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
billingRoutes.get(
        '/wallets/me/payments',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        listWalletPaymentController.execute
);

/**
 * @swagger
 * /billing/escrows/{escrowId}/fund:
 *   post:
 *     summary: Fund escrow account
 *     description: Creator funds an escrow account for a contract/gig before freelancer starts work.
 *     tags:
 *       - Escrow Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: escrowId
 *         required: true
 *         schema:
 *           type: string
 *         description: Escrow account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       201:
 *         description: Escrow funded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 escrow:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
billingRoutes.post(
        '/escrows/:escrowId/fund',
        Authenticate,
        Authorize('CREATOR'),
        fundEscrowAccountController.execute
);

/**
 * @swagger
 * /billing/escrows/{escrowId}/release:
 *   post:
 *     summary: Release escrow funds
 *     description: Creator releases escrow funds to freelancer's wallet after work completion.
 *     tags:
 *       - Escrow Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: escrowId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       200:
 *         description: Escrow released successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
billingRoutes.post(
        '/escrows/:escrowId/release',
        Authenticate,
        Authorize('CREATOR'),
        releaseEscrowController.execute
);

/**
 * @swagger
 * /billing/escrow-transactions/{transactionId}:
 *   get:
 *     summary: Get escrow transaction details
 *     description: Retrieve details of a specific escrow transaction.
 *     tags:
 *       - Escrow Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
billingRoutes.get(
        '/escrow-transactions/:transactionId',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getEscrowAccountTransactionController.execute
);

export { billingRoutes };
