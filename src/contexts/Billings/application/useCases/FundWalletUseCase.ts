import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { ITransactionRepository } from '../../ports/ITransactionRepository.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { Payment } from '../../domain/entities/Payment.js';
import { Transaction } from '../../domain/entities/Transactions.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';
import {
        PaymentChannelType,
        PaymentChannel,
        PaymentProvider
} from '../../domain/enums/DomainEnums.js';
import { PaymentDirection } from '../../domain/enums/DomainEnums.js';
import { TransactionType } from '../../domain/enums/DomainEnums.js';
import { walletRepository } from '../../infrastructure/WalletRepository.js';
import { paymentRepository } from '../../infrastructure/PaymentRepository.js';
import { transactionRepository } from '../../infrastructure/TransactionRepository.js';
import { paystackApapter } from '../../infrastructure/PaystackAdapter.js';

/**
 * FundWalletUseCase
 *
 * - Creates a Payment (INITIATED)
 * - Creates a Transaction record (PENDING) referencing the payment (for idempotency/audit)
 * - Calls provider.initializePayment(...)
 * - Persist provider reference + mark Payment PENDING
 *
 * Important: does NOT credit wallet. Wallet credit happens in webhook verification flow.
 */
export class FundWalletUseCase {
        constructor(
                private readonly walletRepository: IWalletRepository,
                private readonly paymentRepository: IPaymentRepository,
                private readonly transactionRepository: ITransactionRepository,
                private readonly paymentProvider: IPaymentProvider
        ) {}

        async Execute(
                walletId: string,
                userId: string,
                amount: number,
                email: string,
                opts?: {
                        currency?: string;
                        channel?: PaymentChannelType;
                }
        ) {
                // --- Basic validation
                if (!amount || typeof amount !== 'number' || amount <= 0)
                        throw BusinessError.forbidden('Invalid amount');

                const currency = opts?.currency ?? 'NGN';
                const channel = opts?.channel ?? PaymentChannel.CARD;

                // --- fetch wallet
                const wallet = await this.walletRepository.findById(walletId);

                if (!wallet) throw BusinessError.notFound('wallet not found');

                // wallet must belong to user
                if (userId !== wallet.userId)
                        throw BusinessError.unauthorized(
                                'unauthorized: invalid wallet'
                        );

                // wallet must be ACTIVE
                if (wallet.status !== 'ACTIVE')
                        throw BusinessError.forbidden('wallet not active');

                // simple business rule: currency must match wallet currency
                if (wallet.currency && wallet.currency !== currency)
                        throw BusinessError.forbidden('currency mismatch');

                // business rule: maximum per-fund amount (example)
                const MAX_FUND_NAIRA = 200_000; // ₦200,000
                if (amount > MAX_FUND_NAIRA)
                        throw BusinessError.forbidden(
                                'exceeds maximum funding amount'
                        );

                // --- create Payment domain entity (INITIATED)
                const payment = Payment.create({
                        walletId,
                        provider: PaymentProvider.PAYSTACK,
                        amountCents: Math.round(amount * 100),
                        currency,
                        direction: PaymentDirection.INCOMING,
                        cancelReason: null,
                        channel,
                        providerReference: ''
                });

                // Persist Payment (upsert style in repository)
                await this.paymentRepository.save(payment);

                // --- Create a Transaction (PENDING) for audit & idempotency
                const tx = Transaction.create({
                        walletId,
                        paymentId: payment.id,
                        transactionType: TransactionType.CREDIT,
                        amountCents: Math.round(amount * 100),
                        status: 'PENDING',
                        providerReference: '',
                        description: 'fund wallet - initialization',
                        source: 'EXTERNAL_PAYMENT',
                        metadata: {
                                initiatedBy: userId
                        }
                });

                try {
                        await this.transactionRepository.save(tx);
                } catch (err) {
                        // If transaction record fails (unique constraint etc), leave payment but surface error
                        // Do NOT credit wallet here; transaction recording is important for idempotency.
                        throw err;
                }

                // --- Call payment provider (Paystack) to initialize and get checkout URL
                let providerResponse;
                try {
                        providerResponse =
                                await this.paymentProvider.initializePayment({
                                        amount: Math.round(amount * 100),
                                        email,
                                        reference: payment.id, // using our internal payment.id as provider reference
                                        callbackUrl: `${process.env.APP_BASE_URL}/billing/payments/callback`,
                                        metadata: {
                                                walletId,
                                                userId,
                                                paymentId: payment.id,
                                                purpose: 'wallet_funding'
                                        }
                                });
                } catch (error) {
                        // mark payment failed and update repo; keep tx as PENDING (recon)
                        payment.markAsFailed();
                        await this.paymentRepository
                                .save(payment)
                                .catch(() => null);
                        // Optionally: update transaction status to FAILED (not strictly necessary here)
                        await this.transactionRepository
                                .updateStatus(tx.id, 'FAILED')
                                .catch(() => null);
                        throw error; // bubble up so controller can return
                }

                // Provider returned a reference & checkout URL — persist providerReference and mark PENDING
                if (providerResponse?.reference) {
                        // update payment entity
                        payment.addProviderReference(
                                providerResponse.reference
                        );
                        payment.markAsPending(providerResponse.reference);
                        await this.paymentRepository.save(payment);

                        // update transaction to include provider reference
                        tx.addProiderReference(providerResponse.reference);
                        await this.transactionRepository
                                .save(tx)
                                .catch(() => null);
                }

                // --- Return provider response to caller (frontend)
                return {
                        paymentId: payment.id,
                        amount,
                        currency,
                        checkoutUrl: providerResponse.authorizationUrl,
                        providerReference: providerResponse.reference,
                        accessCode: providerResponse.accessCode
                };
        }
}

export const fundWalletUseCase = new FundWalletUseCase(
        walletRepository,
        paymentRepository,
        transactionRepository,
        paystackApapter
);
