import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { Payment } from '../../domain/aggregate-roots/Payment.js';
import { Money } from '../../domain/value-objects/Money.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import {
        PaymentChannel,
        PaymentProvider,
        PaymentDirection
} from '../../domain/enums/DomainEnums.js';
import { WalletNotFoundError } from '../../domain/errors/domainErrors.js';

import { walletRepository } from '../../adapters/WalletRepository.js';
import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { paystackAdapter } from '../../adapters/PaystackAdapter.js';
import { unitOfWork } from '../../adapters/UnitOfWork.js';

export class InitializePaymentUseCase {
        constructor(
                private readonly walletRepository: IWalletRepository,
                private readonly paymentRepository: IPaymentRepository,
                private readonly paymentProvider: IPaymentProvider,
                private readonly unitOfWork: IUnitOfWork
        ) {}

        async Execute(walletId: string, email: string, amount: number) {
                const amountInKobo = Money.create(amount).getAmountInKobo();

                const wallet = await this.walletRepository.findById(walletId);
                if (!wallet) throw new WalletNotFoundError('Wallet not found');

                const payment = Payment.create({
                        walletId: wallet.id,
                        amountKobo: amountInKobo,
                        provider: PaymentProvider.PAYSTACK,
                        currency: 'NGN',
                        direction: PaymentDirection.OUTGOING,
                        channel: PaymentChannel.TRANSFER
                });

                await this.paymentRepository.save(payment);

                const providerResponse = await this.paymentProvider.initializePayment({
                        amount: payment.amountKobo,
                        email,
                        reference: payment.systemReference
                });

                payment.addProviderReference(providerResponse.reference);

                await this.unitOfWork.transaction(async (trx) => {
                        await this.paymentRepository.save(payment, trx);
                });

                return {
                        authorizationUrl: providerResponse.authorizationUrl,
                        reference: providerResponse.reference
                };
        }
}

export const initalizePaymentUseCase = new InitializePaymentUseCase(
        walletRepository,
        paymentRepository,
        paystackAdapter,
        unitOfWork
);
