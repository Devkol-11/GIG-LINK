import { PaymentNotFoundError, ReferenceNotFoundError } from '../../domain/errors/domainErrors.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { PaymentStatus } from '../../domain/enums/DomainEnums.js';

export class VerifyPaymentStatusUseCase {
        constructor(
                private readonly paymentProvider: IPaymentProvider,
                private readonly paymentRepository: IPaymentRepository
        ) {}

        async Execute(systemReference: string) {
                const payment = await this.paymentRepository.findBySystemReference(systemReference);
                if (!payment) throw new PaymentNotFoundError();

                const providerReference = payment.providerReference;
                if (!providerReference) throw new ReferenceNotFoundError();

                // CASE 1 — Already successful
                if (payment.status === PaymentStatus.SUCCESS) {
                        return { status: 'success' };
                }

                // CASE 2 — Still pending → call provider
                if (payment.status === PaymentStatus.PENDING) {
                        const providerResponse =
                                await this.paymentProvider.verifyPayment(providerReference);

                        if (providerResponse.status !== 'success') {
                                return { status: providerResponse.status };
                        }

                        // Provider confirms success → domain mutation
                        payment.markAsSuccess();

                        await this.paymentRepository.save(payment);

                        return { status: 'success' };
                }

                // CASE 3 — Failed or cancelled or otherwise terminal
                return { status: 'failed' };
        }
}
