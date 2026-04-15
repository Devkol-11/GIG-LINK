import { Router } from "express";
import { billingController } from "./billing.controller.js";
import {
  createPaymentSchema,
  createWalletSchema,
  fundEscrowSchema,
  releaseEscrowSchema,
  requestWithdrawalSchema,
  verifyPaymentSchema,
} from "./billing.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../utils/auth.middleware.js";
import { validate } from "../../utils/validate.js";

export const billingRouter = Router();

billingRouter.use(authMiddleware);

billingRouter.post(
  "/payments",
  validate(createPaymentSchema),
  asyncHandler(billingController.createPayment),
);
billingRouter.post(
  "/payments/verify",
  validate(verifyPaymentSchema),
  asyncHandler(billingController.verifyPayment),
);
billingRouter.post(
  "/wallets",
  validate(createWalletSchema),
  asyncHandler(billingController.createWallet),
);
billingRouter.get("/wallets/payments", asyncHandler(billingController.getWalletPayments));
billingRouter.post(
  "/withdrawals",
  validate(requestWithdrawalSchema),
  asyncHandler(billingController.requestWithdrawal),
);
billingRouter.get("/withdrawals", asyncHandler(billingController.getWithdrawals));
billingRouter.post(
  "/escrows/fund",
  validate(fundEscrowSchema),
  asyncHandler(billingController.fundEscrow),
);
billingRouter.post(
  "/escrows/release",
  validate(releaseEscrowSchema),
  asyncHandler(billingController.releaseEscrow),
);
