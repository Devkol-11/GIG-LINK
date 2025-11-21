import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { ITransactionRepository } from '../../ports/ITransactionRepository.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { Transaction } from '../../domain/entities/Transactions.js';
import {
        InvalidSignatureError,
        PaymentNotFoundError
} from '../../domain/errors/BusinessErrors.js';
import { unitOfWork, UnitOfWork } from '../../infrastructure/UnitOfWork.js';
import { paymentRepository } from '../../infrastructure/PaymentRepository.js';
import { walletRepository } from '../../infrastructure/WalletRepository.js';
import { transactionRepository } from '../../infrastructure/TransactionRepository.js';
import { paystackApapter } from '../../infrastructure/PaystackAdapter.js';

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
                // Verify signature
                const isValid = this.paymentProvider.verifySignature(
                        rawBody,
                        signature,
                        this.paystackSecret
                );
                if (!isValid) throw new InvalidSignatureError();

                // Parse event
                const event = JSON.parse(rawBody);

                // Only process charge.success
                if (event.event !== 'charge.success') return;

                const reference = event.data.reference;

                // Load payment by reference
                const payment =
                        await this.paymentRepo.findByReference(reference);
                if (!payment) throw new PaymentNotFoundError();

                // Idempotency: skip if already successful
                if (payment.isSuccessful()) return;

                // Transactional update
                await this.unitOfWork.transaction(async (trx) => {
                        // Mark payment as successful
                        payment.markAsSuccess(reference);
                        await this.paymentRepo.save(payment, trx);

                        // Load wallet by payment.walletId
                        const wallet = await this.walletRepo.findById(
                                payment.walletId,
                                trx
                        );
                        if (!wallet) throw new PaymentNotFoundError(); // should never happen

                        // Fund the wallet
                        wallet.fund(payment.amountCents);
                        await this.walletRepo.save(wallet, trx);

                        // Create transaction
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
