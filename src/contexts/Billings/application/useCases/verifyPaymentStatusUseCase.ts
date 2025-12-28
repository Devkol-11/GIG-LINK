import { PaymentNotFoundError, ReferenceNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { PaymentStatus } from '../../domain/enums/DomainEnums.js';
import { paystackAdapter } from '../../adapters/PaystackAdapter.js';
import { paymentRepository } from '../../adapters/PaymentRepository.js';

export class VerifyPaymentStatusUseCase {
        constructor(
                private readonly paymentProvider: IPaymentProvider,
                private readonly paymentRepository: IPaymentRepository
        ) {}

        async execute(systemReference: string) {
                const payment = await this.paymentRepository.findBySystemReference(systemReference);
                if (!payment) throw new PaymentNotFoundError();

                const providerReference = payment.providerReference;
                if (!providerReference) throw new ReferenceNotFoundError();

                if (payment.status === PaymentStatus.SUCCESS) {
                        return { status: 'success' };
                }

                if (payment.status === PaymentStatus.PENDING) {
                        const providerResponse = await this.paymentProvider.verifyPayment(providerReference);

                        if (providerResponse.status === 'failed') {
                                payment.markAsFailed();
                                await this.paymentRepository.save(payment);
                                return { status: providerResponse.status };
                        }

                        if (providerResponse.status === 'success') {
                                payment.markAsSuccess();
                                await this.paymentRepository.save(payment);
                                return { status: 'success' };
                        }
                }

                return { status: 'pending' };
        }
}

export const verifyPaymentStatusUseCase = new VerifyPaymentStatusUseCase(paystackAdapter, paymentRepository);
