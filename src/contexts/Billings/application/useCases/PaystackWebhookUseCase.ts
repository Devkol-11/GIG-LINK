import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { ITransactionRepository } from '../../ports/ITransactionRepository.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { Transaction } from '../../domain/entities/Transactions.js';
import {
        InvalidSignatureError,
        PaymentNotFoundError
} from '../../domain/errors/BusinessErrors.js';
import { unitOfWork, UnitOfWork } from '../../adapters/UnitOfWork.js';
import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { transactionRepository } from '../../adapters/TransactionRepository.js';
import { paystackApapter } from '../../adapters/PaystackAdapter.js';

export class PaystackWebhookHandlerUseCase {
        constructor(
                private paymentRepo: IPaymentRepository,
                private walletRepo: IWalletRepository,
                private transactionRepo: ITransactionRepository,
                private paymentProvider: IPaymentProvider,
                private unitOfWork: UnitOfWork,
                private paystackSecret: string
        ) {}

        async execute(rawBody: string, signature: string) {
                const isValid = this.paymentProvider.verifySignature(
                        rawBody,
                        signature,
                        this.paystackSecret
                );

                if (!isValid) throw new InvalidSignatureError();

                const event = JSON.parse(rawBody);

                if (event.event !== 'charge.success') return;

                const reference = event.data.reference;

                const payment =
                        await this.paymentRepo.findByReference(reference);
                if (!payment) throw new PaymentNotFoundError();

                if (payment.isSuccessful()) return;

                await this.unitOfWork.transaction(async (trx) => {
                        payment.markAsSuccess(reference);
                        await this.paymentRepo.save(payment, trx);

                        const wallet = await this.walletRepo.findById(
                                payment.walletId,
                                trx
                        );
                        if (!wallet) throw new PaymentNotFoundError();

                        wallet.fund(payment.amountCents);
                        await this.walletRepo.save(wallet, trx);

                        const tx = Transaction.create({
                                walletId: wallet.id,
                                amountCents: payment.amountCents,
                                paymentId: payment.id,
                                transactionType: 'CREDIT',
                                status: 'SUCCESS',
                                metadata: { provider: 'PAYSTACK', raw: event },
                                providerReference: reference,
                                description: null,
                                source: 'EXTERNAL_PAYMENT'
                        });

                        await this.transactionRepo.save(tx, trx);
                });
        }
}

export const paystackWebhookHandlerUseCase = new PaystackWebhookHandlerUseCase(
        paymentRepository,
        walletRepository,
        transactionRepository,
        paystackApapter,
        unitOfWork
);
