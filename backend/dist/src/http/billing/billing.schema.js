import { z } from "zod";
export const createPaymentSchema = {
    body: z.object({
        amount: z.number().positive(),
        reference: z.string().min(1),
        email: z.email(),
    }),
};
export const verifyPaymentSchema = {
    body: z.object({
        reference: z.string().min(1),
    }),
};
export const createWalletSchema = {
    body: z.object({
        accountNumber: z.string().length(10),
        bankCode: z.string().min(3),
    }),
};
export const requestWithdrawalSchema = {
    body: z.object({
        amount: z.number().positive(),
        walletId: z.uuid(),
    }),
};
export const fundEscrowSchema = {
    body: z.object({
        contractId: z.uuid(),
        amount: z.number().positive(),
        reference: z.string().min(1),
    }),
};
export const releaseEscrowSchema = {
    body: z.object({
        escrowId: z.uuid(),
    }),
};
