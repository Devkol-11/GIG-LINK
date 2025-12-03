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
import { walletRepository } from '../../adapters/WalletRepository.js';
import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { transactionRepository } from '../../adapters/TransactionRepository.js';
import { paystackApapter } from '../../adapters/PaystackAdapter.js';

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
                if (!amount || typeof amount !== 'number' || amount <= 0)
                        throw BusinessError.forbidden('Invalid amount');

                const currency = opts?.currency ?? 'NGN';
                const channel = opts?.channel ?? PaymentChannel.CARD;

                const wallet = await this.walletRepository.findById(walletId);

                if (!wallet) throw BusinessError.notFound('wallet not found');

                if (userId !== wallet.userId)
                        throw BusinessError.unauthorized(
                                'unauthorized: invalid wallet'
                        );

                if (wallet.status !== 'ACTIVE')
                        throw BusinessError.forbidden('wallet not active');

                if (wallet.currency && wallet.currency !== currency)
                        throw BusinessError.forbidden('currency mismatch');

                const MAX_FUND_NAIRA = 200_000;

                if (amount > MAX_FUND_NAIRA)
                        throw BusinessError.forbidden(
                                'exceeds maximum funding amount'
                        );

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

                await this.paymentRepository.save(payment);

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
                        throw err;
                }

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
                        payment.markAsFailed();

                        await this.paymentRepository
                                .save(payment)
                                .catch(() => null);

                        await this.transactionRepository
                                .updateStatus(tx.id, 'FAILED')
                                .catch(() => null);

                        throw error;
                }

                if (providerResponse?.reference) {
                        payment.addProviderReference(
                                providerResponse.reference
                        );

                        payment.markAsPending(providerResponse.reference);

                        await this.paymentRepository.save(payment);

                        tx.addProviderReference(providerResponse.reference);

                        await this.transactionRepository
                                .save(tx)
                                .catch(() => null);
                }

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
