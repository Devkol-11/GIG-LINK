import { IPaymentRepository } from '../ports/IPaymentRepository.js';
import { Payment } from '../domain/aggregate-roots/Payment.js';
import { PaymentStatus, PaymentStatusType } from '../domain/enums/DomainEnums.js';
import { prismaDbClient } from '@core/database/prisma.client.js';
import { Prisma } from 'prisma/generated/prisma/client.js';
import { ConcurrencyError } from '../domain/errors/concurrencyError.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

//------1: findById
export class PaymentRepository implements IPaymentRepository {
        constructor() {}

        async findById(id: string, trx?: Prisma.TransactionClient): Promise<Payment | null> {
                const client = trx ? trx : prismaDbClient;

                const paymentData = await client.payment.findUnique({
                        where: { id }
                });

                if (!paymentData) return null;

                return Payment.toEntity(paymentData);
        }

        //-----2: findByProviderReference
        async findByProviderReference(
                providerReference: string,
                trx?: Prisma.TransactionClient
        ): Promise<Payment | null> {
                const client = trx ? trx : prismaDbClient;

                const paymentData = await client.payment.findUnique({
                        where: { providerReference: providerReference }
                });

                if (!paymentData) return null;

                return Payment.toEntity(paymentData);
        }

        async findBySystemReference(
                systemReference: string,
                trx?: Prisma.TransactionClient
        ): Promise<Payment | null> {
                const client = trx ? trx : prismaDbClient;

                const paymentData = await client.payment.findUnique({
                        where: { systemReference }
                });

                if (!paymentData) return null;

                return Payment.toEntity(paymentData);
        }

        //-----3: findAllByWalletId
        async findAllByWalletId(
                walletId: string,
                trx?: Prisma.TransactionClient
        ): Promise<Payment[]> {
                const client = trx ? trx : prismaDbClient;

                const paymentsData = await client.payment.findMany({
                        where: { walletId },
                        orderBy: { createdAt: 'desc' }
                });

                return paymentsData.map((payment) => Payment.toEntity(payment));
        }

        //-----4: save
        async save(payment: Payment, trx?: Prisma.TransactionClient): Promise<Payment> {
                const client = trx ? trx : prismaDbClient;

                const domain = payment.getState();

                try {
                        const updatedPayment = await client.payment.upsert({
                                where: { id: domain.id },
                                update: {
                                        ...domain,
                                        cancelReason: domain.cancelReason
                                                ? domain.cancelReason
                                                : 'nil'
                                },
                                create: {
                                        id: domain.id,
                                        walletId: domain.walletId,
                                        provider: domain.provider,
                                        amountKobo: domain.amountKobo,
                                        channel: domain.channel,
                                        systemReference: domain.systemReference,
                                        cancelReason: domain.cancelReason
                                                ? domain.cancelReason
                                                : 'nil',
                                        direction: domain.direction,
                                        currency: domain.currency,
                                        status: domain.status,
                                        providerReference: domain.providerReference,
                                        createdAt: domain.createdAt,
                                        updatedAt: domain.updatedAt
                                }
                        });

                        return Payment.toEntity(updatedPayment);
                } catch (error) {
                        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                                if (error.code === 'P2002') {
                                        throw BusinessError.conflict(
                                                'Payment with this reference already exists'
                                        );
                                }
                                if (error.code === 'P2025') {
                                        throw ConcurrencyError.conflict(
                                                'Payment was modified by another process'
                                        );
                                }
                        }
                        throw error;
                }
        }

        //-----5: updateStatus
        async updateStatus(
                paymentId: string,
                status: PaymentStatusType,
                trx?: Prisma.TransactionClient
        ): Promise<void> {
                const client = trx ? trx : prismaDbClient;
                try {
                        await client.payment.update({
                                where: { id: paymentId },
                                data: {
                                        status,
                                        updatedAt: new Date()
                                }
                        });
                } catch (error) {
                        if (
                                error instanceof Prisma.PrismaClientKnownRequestError &&
                                error.code === 'P2025'
                        ) {
                                throw BusinessError.notFound('Payment not found');
                        }
                        throw error;
                }
        }

        //------6: findPendingOlderThan
        async findPendingOlderThan(date: Date, trx?: Prisma.TransactionClient): Promise<Payment[]> {
                const client = trx ? trx : prismaDbClient;
                const paymentsData = await client.payment.findMany({
                        where: {
                                status: PaymentStatus.PENDING,
                                createdAt: { lt: date }
                        },
                        orderBy: { createdAt: 'asc' }
                });

                return paymentsData.map((payment) => Payment.toEntity(payment));
        }

        //-----7: findSuccessInDateRange
        async findSuccessInDateRange(
                startDate: Date,
                endDate: Date,
                trx?: Prisma.TransactionClient
        ): Promise<Payment[]> {
                const client = trx ? trx : prismaDbClient;
                const paymentsData = await client.payment.findMany({
                        where: {
                                status: PaymentStatus.SUCCESS,
                                createdAt: {
                                        gte: startDate,
                                        lte: endDate
                                }
                        },
                        orderBy: { createdAt: 'desc' }
                });

                return paymentsData.map((payment) => Payment.toEntity(payment));
        }

        async findByWalletId(
                walletId: string,
                trx?: Prisma.TransactionClient
        ): Promise<Payment | null> {
                const client = trx ? trx : prismaDbClient;

                const paymentRecord = await client.payment.findUnique({ where: { walletId } });

                if (!paymentRecord) return null;

                return Payment.toEntity(paymentRecord);
        }
}
export const paymentRepository = new PaymentRepository();
