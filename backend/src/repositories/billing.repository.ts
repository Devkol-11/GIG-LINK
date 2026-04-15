import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import {
  EscrowStatus,
  EscrowTransactionType,
  PaymentChannel,
  PaymentDirection,
  PaymentProvider,
  PaymentStatus,
  TransactionSource,
  TransactionStatus,
  TransactionType,
  WalletStatus,
} from "../../prisma/generated/prisma/enums.js";
import { AppError } from "../utils/error.js";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient({} as never);
globalForPrisma.prisma = prisma;

export const billingRepository = {
  async findOrCreateWallet(userId: string) {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });

    if (wallet) {
      return wallet;
    }

    return prisma.wallet.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        currency: "NGN",
        status: WalletStatus.ACTIVE,
      },
    });
  },

  createPayment(walletId: string, data: { amount: number; reference: string; email: string }) {
    return prisma.payment.create({
      data: {
        id: crypto.randomUUID(),
        walletId,
        systemReference: data.reference,
        provider: PaymentProvider.PAYSTACK,
        amountKobo: Math.round(data.amount * 100),
        currency: "NGN",
        direction: PaymentDirection.INCOMING,
        status: PaymentStatus.INITIATED,
        channel: PaymentChannel.CARD,
        cancelReason: "",
        failedReason: "",
        reversedReason: "",
        meta: { email: data.email },
      },
    });
  },

  getPaymentByReference(reference: string) {
    return prisma.payment.findUnique({
      where: { systemReference: reference },
      include: {
        wallet: true,
      },
    });
  },

  async markPaymentSuccessful(reference: string) {
    const payment = await prisma.payment.update({
      where: { systemReference: reference },
      data: {
        status: PaymentStatus.SUCCESS,
      },
      include: {
        wallet: true,
      },
    });

    await prisma.wallet.update({
      where: { id: payment.walletId },
      data: {
        balanceKobo: {
          increment: payment.amountKobo,
        },
      },
    });

    return payment;
  },

  createTransaction(data: {
    walletId: string;
    paymentId: string;
    amountKobo: number;
    systemReference: string;
    providerReference: string;
    transactionType: TransactionType;
    source: TransactionSource;
    description: string;
  }) {
    return prisma.transaction.create({
      data: {
        id: crypto.randomUUID(),
        walletId: data.walletId,
        paymentId: data.paymentId,
        amountKobo: data.amountKobo,
        systemReference: data.systemReference,
        providerReference: data.providerReference,
        transactionType: data.transactionType,
        status: TransactionStatus.SUCCESS,
        source: data.source,
        description: data.description,
        metadata: {},
      },
    });
  },

  createOrUpdateWalletRecipient(userId: string, data: { accountNumber: string; bankCode: string }) {
    return prisma.paymentRecipient.upsert({
      where: { userId },
      create: {
        id: crypto.randomUUID(),
        userId,
        code: `recipient_${data.bankCode}_${data.accountNumber}`,
        accountNumber: data.accountNumber,
        accountName: "Pending Verification",
        createdAt: new Date(),
      },
      update: {
        code: `recipient_${data.bankCode}_${data.accountNumber}`,
        accountNumber: data.accountNumber,
      },
    });
  },

  async getWalletPayments(userId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return wallet?.payments ?? [];
  },

  getWalletByIdForUser(userId: string, walletId: string) {
    return prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });
  },

  async createWithdrawalTransaction(walletId: string, amount: number) {
    const amountKobo = Math.round(amount * 100);
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balanceKobo: {
          decrement: amountKobo,
        },
      },
    });

    const payment = await prisma.payment.create({
      data: {
        id: crypto.randomUUID(),
        walletId,
        systemReference: crypto.randomUUID(),
        provider: PaymentProvider.PAYSTACK,
        amountKobo,
        currency: wallet.currency,
        direction: PaymentDirection.OUTGOING,
        status: PaymentStatus.PENDING,
        channel: PaymentChannel.TRANSFER,
        cancelReason: "",
        failedReason: "",
        reversedReason: "",
        meta: { type: "withdrawal" },
      },
    });

    return prisma.transaction.create({
      data: {
        id: crypto.randomUUID(),
        walletId,
        paymentId: payment.id,
        amountKobo,
        systemReference: crypto.randomUUID(),
        providerReference: crypto.randomUUID(),
        transactionType: TransactionType.DEBIT,
        status: TransactionStatus.PENDING,
        source: TransactionSource.USER,
        description: "Withdrawal request",
        metadata: {},
      },
    });
  },

  async getWithdrawals(userId: string) {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });

    if (!wallet) {
      return [];
    }

    return prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        transactionType: TransactionType.DEBIT,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getContractById(contractId: string) {
    return prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        escrowAccount: true,
      },
    });
  },

  async createOrUpdateEscrow(data: {
    contractId: string;
    creatorId: string;
    freelancerId: string;
    amountKobo: number;
  }) {
    return prisma.escrowAccount.upsert({
      where: { contractId: data.contractId },
      create: {
        id: crypto.randomUUID(),
        contractId: data.contractId,
        creatorId: data.creatorId,
        freelancerId: data.freelancerId,
        balanceKobo: data.amountKobo,
        expectedAmountKobo: data.amountKobo,
        currency: "NGN",
        status: EscrowStatus.HELD,
      },
      update: {
        balanceKobo: {
          increment: data.amountKobo,
        },
        expectedAmountKobo: data.amountKobo,
        status: EscrowStatus.HELD,
      },
    });
  },

  createEscrowTransaction(data: {
    escrowId: string;
    amountKobo: number;
    reference?: string;
    type: EscrowTransactionType;
    description: string;
  }) {
    return prisma.escrowTransaction.create({
      data: {
        id: crypto.randomUUID(),
        escrowId: data.escrowId,
        amountKobo: data.amountKobo,
        reference: data.reference,
        type: data.type,
        status: TransactionStatus.SUCCESS,
        description: data.description,
      },
    });
  },

  getEscrowById(escrowId: string) {
    return prisma.escrowAccount.findUnique({
      where: { id: escrowId },
    });
  },

  releaseEscrow(escrowId: string) {
    return prisma.escrowAccount.update({
      where: { id: escrowId },
      data: {
        status: EscrowStatus.RELEASED,
        locked: false,
        balanceKobo: 0,
      },
    });
  },

  async creditFreelancerWallet(userId: string, amountKobo: number) {
    const wallet = await this.findOrCreateWallet(userId);

    return prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balanceKobo: {
          increment: amountKobo,
        },
      },
    });
  },
};
