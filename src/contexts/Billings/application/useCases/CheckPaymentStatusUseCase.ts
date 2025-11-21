import { BusinessError } from '@src/shared/errors/BusinessError.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { paystackApapter } from '../../infrastructure/PaystackAdapter.js';
import { paymentRepository } from '../../infrastructure/PaymentRepository.js';

export class CheckPaymentStatusUseCase {
        constructor(
                private paymentRepo: IPaymentRepository,
                private paystackProvider: IPaymentProvider
        ) {}

        async execute(paymentId: string) {
                //  Load payment
                const payment = await this.paymentRepo.findById(paymentId);
                if (payment === null)
                        throw BusinessError.notFound('payment not found');

                // 2. If already final state → return immediately
                if (payment.isFinalState()) {
                        return {
                                paymentId: payment.id,
                                status: payment.status,
                                amount: payment.amount,
                                reference: payment.providerReference
                        };
                }

                // Hit Paystack to verify
                const gatewayStatus = await this.paystackProvider.verifyPayment(
                        payment.providerReference
                );

                // If Paystack says “success”
                if (gatewayStatus.status === 'success') {
                        payment.markAsSuccess(gatewayStatus.reference);
                        await this.paymentRepo.save(payment);

                        return {
                                paymentId: payment.id,
                                status: payment.status,
                                reference: payment.providerReference,
                                amount: payment.amount
                        };
                }

                // If Paystack says “failed”
                if (gatewayStatus.status === 'failed') {
                        payment.markAsFailed();
                        await this.paymentRepo.save(payment);

                        return {
                                paymentId: payment.id,
                                status: payment.status,
                                reference: payment.providerReference,
                                amount: payment.amount
                        };
                }

                // Otherwise still pending
                return {
                        paymentId: payment.id,
                        status: payment.status,
                        reference: payment.providerReference,
                        amount: payment.amount
                };
        }
}

export const checkPaymentStatusUseCase = new CheckPaymentStatusUseCase(
        paymentRepository,
        paystackApapter
);
