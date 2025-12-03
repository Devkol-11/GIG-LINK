import { BusinessError } from '@src/shared/errors/BusinessError.js';
import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';

export class GetPaymentUseCase {
        constructor(private paymentRepo: IPaymentRepository) {}

        async execute(paymentId: string) {
                const payment = await this.paymentRepo.findById(paymentId);

                if (!payment) {
                        throw BusinessError.notFound('Payment not found');
                }

                return payment.getState();
        }
}

export const getPaymentUseCase = new GetPaymentUseCase(paymentRepository);
