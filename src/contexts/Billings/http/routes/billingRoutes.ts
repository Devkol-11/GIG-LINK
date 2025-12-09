import { Router } from 'express';
import express from 'express';
import { Authenticate } from '@src/shared/middlewares/auth.js';
import { Authorize } from '@src/shared/middlewares/auth.js';
import { verifyWebhookSignature } from '../middlewares/verifyWebhookSignature.js';
import { captureRawBody } from '../middlewares/captureRawBody.js';
import { initializePaymentController } from '../controllers/initializePaymentController.js';

const billingRoutes = Router();

billingRoutes.post(
        '/payments/init',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        initializePaymentController.Execute
);

// Webhook — public
billingRoutes.post('/payments/webhook', captureRawBody, verifyWebhookSignature, express.json());

billingRoutes.get(
        '/payments/:paymentId',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getPaymentController.Execute
);

billingRoutes.get(
        '/payments/:paymentId/status',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        checkPaymentStatusController.Execute
);

billingRoutes.post(
        '/wallets',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        createWalletController.Execute
);

billingRoutes.get(
        '/wallets/:walletId',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getWalletController.Execute
);

billingRoutes.get(
        '/wallets/user/:userId',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getWalletByUserController.Execute
);

billingRoutes.get(
        '/wallets/:walletId/payments',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getWalletPaymentsController.Execute
);

billingRoutes.get(
        '/wallets/:walletId/transactions',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        listWalletTransactionsController.Execute
);

billingRoutes.get(
        '/transactions',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        listTransactionsByQueryController.Execute
);

billingRoutes.get(
        '/transactions/wallet/:walletId',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        listWalletTransactionsController.Execute
);

export { billingRoutes };
