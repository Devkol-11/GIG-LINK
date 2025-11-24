import { Router } from 'express';
import { Authenticate } from '@src/shared/middlewares/auth.js';
import { Authorize } from '@src/shared/middlewares/auth.js';

/* ------------ CONTROLLERS ------------ */

import { paystackWebhookController } from '../controllers/PaystackWebhookController.js';
import { getPaymentController } from '../controllers/GetPaymentController.js';
import { findPaymentByReferenceController } from '../controllers/FindPaymentByReferenceController.js';
import { checkPaymentStatusController } from '../controllers/CheckPaymentStatusController.js';
import { cancelPaymentController } from '../controllers/CancelPaymentController.js';

import { fundWalletController } from '../controllers/FundWalletController.js';
import { createWalletController } from '../controllers/CreateWalletController.js';
import { getWalletController } from '../controllers/GetWalletController.js';
import { getWalletByUserController } from '../controllers/GetWalletByUserController.js';
import { getWalletPaymentsController } from '../controllers/GetWalletPaymentsController.js';
import { listWalletTransactionsController } from '../controllers/ListWalletTransactionsController.js';

import { debitWalletController } from '../controllers/DebitWalletController.js';
import { reserveWalletFundsController } from '../controllers/ReserveWalletFundsController.js';
import { releaseReservedFundsController } from '../controllers/ReleaseReservedFundsController.js';

import { getTransactionController } from '../controllers/GetTransactionController.js';
import { getTransactionsByPaymentController } from '../controllers/GetTransactionsByPaymentController.js';
import { listTransactionsByQueryController } from '../controllers/ListTransactionsByQueryController.js';

const billingRoutes = Router();

/* ---------------------------------- PAYMENTS ---------------------------------- */

billingRoutes.post(
        '/payments/init',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        fundWalletController.Execute
);

// Webhook — public
billingRoutes.post(
        '/payments/webhook',
        paystackWebhookController.handlePaystackWebhook
);

billingRoutes.get(
        '/payments/:paymentId',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getPaymentController.Execute
);

billingRoutes.get(
        '/payments/reference/:reference',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        findPaymentByReferenceController.Execute
);

billingRoutes.get(
        '/payments/:paymentId/status',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        checkPaymentStatusController.Execute
);

billingRoutes.patch(
        '/payments/:id/cancel',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        cancelPaymentController.Execute
);

/* ---------------------------------- WALLETS ---------------------------------- */

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

billingRoutes.post(
        '/wallets/:walletId/fund',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        fundWalletController.Execute
);

billingRoutes.post(
        '/wallets/:walletId/debit',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        debitWalletController.Execute
);

billingRoutes.post(
        '/wallets/:walletId/reserve',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        reserveWalletFundsController.Execute
);

billingRoutes.post(
        '/wallets/:walletId/release',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        releaseReservedFundsController.Execute
);

/* -------------------------------- TRANSACTIONS -------------------------------- */

billingRoutes.get(
        '/transactions/:transactionId',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getTransactionController.Execute
);

billingRoutes.get(
        '/payments/:paymentId/transactions',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getTransactionsByPaymentController.Execute
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
