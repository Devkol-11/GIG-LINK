import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import {
        PaymentNotFoundError,
        InvalidPaymentStateError
} from '../../domain/errors/BusinessErrors.js';
import { paymentRepository } from '../../infrastructure/PaymentRepository.js';

export class CancelPaymentUseCase {
        constructor(private paymentRepo: IPaymentRepository) {}

        async Execute(paymentId: string, reason?: string) {
                const payment = await this.paymentRepo.findById(paymentId);

                if (!payment) throw new PaymentNotFoundError();

                if (payment.canBeCancelled() === false) {
                        throw new InvalidPaymentStateError(
                                'Payment cannot be cancelled from its current state'
                        );
                }

                payment.cancel(reason);

                await this.paymentRepo.save(payment);

                return payment.getState();
        }
}

export const cancelPaymentUseCase = new CancelPaymentUseCase(paymentRepository);
