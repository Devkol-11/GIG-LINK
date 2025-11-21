import { BusinessError } from '@src/shared/errors/BusinessError.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { paymentRepository } from '../../infrastructure/PaymentRepository.js';

export class FindPaymentByReferenceUseCase {
        constructor(private paymentRepository: IPaymentRepository) {}

        async Execute(reference: string) {
                const payment =
                        await this.paymentRepository.findByReference(reference);

                if (!payment) throw BusinessError.notFound('payment not found');

                return payment.getState();
        }
}

export const findPaymentByReferenceUseCase = new FindPaymentByReferenceUseCase(
        paymentRepository
);
