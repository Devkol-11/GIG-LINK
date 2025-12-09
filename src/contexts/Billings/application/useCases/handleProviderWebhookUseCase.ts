import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { unitOfWork } from '../../adapters/UnitOfWork.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { PaymentStatus } from '../../domain/enums/DomainEnums.js';
import { PaymentNotFoundError, WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { PaymentWebHookEvent } from '../dtos/webhookEvent.js';

export class VerifyPaymentWebhookUseCase {
        constructor(
                private readonly paymentRepository: IPaymentRepository,
                private readonly walletRepository: IWalletRepository,
                private readonly unitOfwork: IUnitOfWork
        ) {}

        async Execute(webhookEvent: PaymentWebHookEvent) {
                const payment = await this.paymentRepository.findByProviderReference(
                        webhookEvent.data.reference
                );

                if (!payment) throw new PaymentNotFoundError();

                const isSuccessful = webhookEvent.event === 'charge.success';

                if (!isSuccessful) {
                        // handle refunds , reversals , chargebacks later
                        return { status: 'ignored' };
                        // add logs for prod
                }
                // ensuring idempotency
                if (payment.status === PaymentStatus.SUCCESS) {
                        return { status: 'already processed' };
                }

                const result = await this.unitOfwork.transaction(async (trx) => {
                        payment.markAsSuccess();

                        await this.paymentRepository.save(payment, trx);

                        const wallet = await this.walletRepository.findById(payment.walletId, trx);

                        if (!wallet) {
                                // should not EVER occur
                                throw new WalletNotFoundError();
                                // add logs for prod
                        }

                        wallet.fund(payment.amountKobo);

                        await this.walletRepository.save(wallet, trx);

                        return { status: 'success' };
                });

                return result;
        }
}

export const verifyPaymentWebhookUsecase = new VerifyPaymentWebhookUseCase(
        paymentRepository,
        walletRepository,
        unitOfWork
);
