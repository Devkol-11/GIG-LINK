import { PaymentNotFoundError, WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { WithdrawalWebhookCommand } from '../dtos/WithdrawalDTO.js';
import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { unitOfWork } from '../../adapters/UnitOfWork.js';

export class VerifyWithdrawalWebhookUseCase {
        constructor(
                private readonly paymentRepository: IPaymentRepository,
                private readonly walletRepository: IWalletRepository,
                private readonly unitOfWork: IUnitOfWork
        ) {}

        async execute(event: WithdrawalWebhookCommand) {
                const providerReference = event.data.reference;

                const payment = await this.paymentRepository.findByProviderReference(providerReference);
                if (!payment) throw new PaymentNotFoundError();

                const wallet = await this.walletRepository.findById(payment.walletId);
                if (!wallet) throw new WalletNotFoundError();

                // Idempotency – if already success, ignore
                if (payment.status === 'SUCCESS') {
                        return { status: 'already processed' };
                }

                // HANDLE: transfer.reversed
                if (event.event === 'transfer.reversed') {
                        await this.unitOfWork.transaction(async (trx) => {
                                payment.markAsReversed();
                                wallet.fund(payment.amountKobo);
                                await this.paymentRepository.save(payment, trx);
                                await this.walletRepository.save(wallet, trx);
                        });

                        return { status: 'reversed' };
                }

                // HANDLE: transfer.failed
                if (event.event === 'transfer.failed') {
                        await this.unitOfWork.transaction(async (trx) => {
                                payment.markAsFailed();
                                wallet.fund(payment.amountKobo);
                                await this.paymentRepository.save(payment, trx);
                                await this.walletRepository.save(wallet, trx);
                        });

                        return { status: 'failed' };
                }

                // HANDLE: transfer.success
                if (event.event === 'transfer.success') {
                        await this.unitOfWork.transaction(async (trx) => {
                                payment.markAsSuccess();
                                await this.paymentRepository.save(payment, trx);
                        });

                        return { status: 'success' };
                }

                // Unknown event — ignore safely, do not mutate state
                return { status: 'ignored' };
        }
}

export const verifyWithdrawalWebhookUseCase = new VerifyWithdrawalWebhookUseCase(
        paymentRepository,
        walletRepository,
        unitOfWork
);
