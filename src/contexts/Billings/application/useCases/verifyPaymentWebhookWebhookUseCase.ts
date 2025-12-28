import { TransactionSource } from 'prisma/generated/prisma/enums.js';
import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { unitOfWork } from '../../adapters/UnitOfWork.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { Transaction } from '../../domain/entities/Transactions.js';
import { PaymentStatus, TransactionStatus, TransactionType } from '../../domain/enums/DomainEnums.js';
import { PaymentNotFoundError, WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { PaymentWebHookEvent } from '../dtos/PaymentDTO.js';
import { ITransactionRepository } from '../../ports/ITransactionRepository.js';
import { transactionRepository } from '../../adapters/TransactionRepository.js';

export class VerifyPaymentWebhookUseCase {
        constructor(
                private readonly paymentRepository: IPaymentRepository,
                private readonly walletRepository: IWalletRepository,
                private readonly transactionRepository: ITransactionRepository,
                private readonly unitOfwork: IUnitOfWork
        ) {}

        async execute(webhookEvent: PaymentWebHookEvent) {
                const payment = await this.paymentRepository.findByProviderReference(
                        webhookEvent.data.reference
                );

                if (!payment) throw new PaymentNotFoundError();

                const isSuccessful: boolean = webhookEvent.event === 'charge.success';

                if (!isSuccessful) {
                        // handle refunds , reversals , chargebacks later
                        return { status: 'ignored' };
                        // add logs for prod
                }
                // ensuring idempotency
                if (payment.status === PaymentStatus.SUCCESS) {
                        return { status: 'already processed' };
                }

                const wallet = await this.walletRepository.findById(payment.walletId);

                if (!wallet) {
                        // should not EVER occur
                        throw new WalletNotFoundError();
                        // add logs for prod
                }

                const result = await this.unitOfwork.transaction(async (trx) => {
                        payment.markAsSuccess();

                        await this.paymentRepository.save(payment, trx);

                        wallet.fund(payment.amountKobo);

                        await this.walletRepository.save(wallet, trx);

                        const transaction = Transaction.create({
                                status: TransactionStatus.SUCCESS,
                                walletId: payment.walletId,
                                paymentId: payment.id,
                                amountKobo: payment.amountKobo,
                                providerReference: payment.providerReference
                                        ? payment.providerReference
                                        : 'nil',
                                transactionType: TransactionType.CREDIT,

                                description: '',
                                source: TransactionSource.USER,
                                metadata: ''
                        });

                        await this.transactionRepository.save(transaction, trx);

                        return { status: 'success' };
                });

                return result;
        }
}

export const verifyPaymentWebhookUsecase = new VerifyPaymentWebhookUseCase(
        paymentRepository,
        walletRepository,
        transactionRepository,
        unitOfWork
);
