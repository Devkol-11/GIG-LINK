import { EscrowTransactionType, TransactionSource, TransactionType, } from "../../prisma/generated/prisma/enums.js";
import { billingRepository } from "../repositories/billing.repository.js";
import { AppError } from "../utils/error.js";
export const billingService = {
    async createPayment(userId, data) {
        const wallet = await billingRepository.findOrCreateWallet(userId);
        const payment = await billingRepository.createPayment(wallet.id, data);
        return {
            payment,
            paymentUrl: `https://pay.example.com/checkout/${payment.systemReference}`,
        };
    },
    async verifyPayment(_userId, data) {
        const payment = await billingRepository.getPaymentByReference(data.reference);
        if (!payment) {
            throw new AppError("Payment not found", 404);
        }
        const updatedPayment = await billingRepository.markPaymentSuccessful(data.reference);
        await billingRepository.createTransaction({
            walletId: updatedPayment.walletId,
            paymentId: updatedPayment.id,
            amountKobo: updatedPayment.amountKobo,
            systemReference: `${updatedPayment.systemReference}_credit`,
            providerReference: updatedPayment.providerReference ?? crypto.randomUUID(),
            transactionType: TransactionType.CREDIT,
            source: TransactionSource.EXTERNAL_PAYMENT,
            description: "Wallet funding",
        });
        return updatedPayment;
    },
    createWallet(userId, data) {
        return billingRepository.createOrUpdateWalletRecipient(userId, data);
    },
    getWalletPayments(userId) {
        return billingRepository.getWalletPayments(userId);
    },
    async requestWithdrawal(userId, data) {
        const wallet = await billingRepository.getWalletByIdForUser(userId, data.walletId);
        if (!wallet) {
            throw new AppError("Wallet not found", 404);
        }
        const amountKobo = Math.round(data.amount * 100);
        if (wallet.balanceKobo < amountKobo) {
            throw new AppError("Insufficient wallet balance", 400);
        }
        return billingRepository.createWithdrawalTransaction(wallet.id, data.amount);
    },
    getWithdrawals(userId) {
        return billingRepository.getWithdrawals(userId);
    },
    async fundEscrow(userId, data) {
        const contract = await billingRepository.getContractById(data.contractId);
        if (!contract) {
            throw new AppError("Contract not found", 404);
        }
        if (contract.creatorId !== userId) {
            throw new AppError("Only the creator can fund escrow", 403);
        }
        const escrow = await billingRepository.createOrUpdateEscrow({
            contractId: contract.id,
            creatorId: contract.creatorId,
            freelancerId: contract.freelancerId,
            amountKobo: Math.round(data.amount * 100),
        });
        await billingRepository.createEscrowTransaction({
            escrowId: escrow.id,
            amountKobo: Math.round(data.amount * 100),
            reference: data.reference,
            type: EscrowTransactionType.FUND,
            description: "Escrow funded",
        });
        return escrow;
    },
    async releaseEscrow(userId, data) {
        const escrow = await billingRepository.getEscrowById(data.escrowId);
        if (!escrow) {
            throw new AppError("Escrow not found", 404);
        }
        if (escrow.creatorId !== userId) {
            throw new AppError("Only the creator can release escrow", 403);
        }
        const releasedEscrow = await billingRepository.releaseEscrow(data.escrowId);
        await billingRepository.createEscrowTransaction({
            escrowId: data.escrowId,
            amountKobo: escrow.balanceKobo,
            type: EscrowTransactionType.RELEASE,
            description: "Escrow released",
        });
        await billingRepository.creditFreelancerWallet(escrow.freelancerId, escrow.balanceKobo);
        return releasedEscrow;
    },
};
