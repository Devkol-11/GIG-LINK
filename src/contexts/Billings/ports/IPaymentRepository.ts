import { Primitives } from 'joi';
import { Payment } from '../domain/aggregate-roots/Payment.js';
import { PaymentStatusType } from '../domain/enums/DomainEnums.js';
import { Prisma } from 'prisma/generated/prisma/client.js';

export interface IPaymentRepository {
        findById(id: string, trx?: Prisma.TransactionClient): Promise<Payment | null>;

        findByProviderReference(
                reference: string,
                trx?: Prisma.TransactionClient
        ): Promise<Payment | null>;

        findBySystemReference(
                reference: string,
                trx?: Prisma.TransactionClient
        ): Promise<Payment | null>;

        findByWalletId(walletId: string, trx?: Prisma.TransactionClient): Promise<Payment | null>;
        findAllByWalletId(walletId: string, trx?: Prisma.TransactionClient): Promise<Payment[]>;

        save(payment: Payment, trx?: Prisma.TransactionClient): Promise<Payment>;

        updateStatus(
                paymentId: string,
                status: PaymentStatusType,
                trx?: Prisma.TransactionClient
        ): Promise<void>;

        findPendingOlderThan(date: Date, trx?: Prisma.TransactionClient): Promise<Payment[]>;

        findSuccessInDateRange(
                startDate: Date,
                endDate: Date,
                trx?: Prisma.TransactionClient
        ): Promise<Payment[]>;
}
