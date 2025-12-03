import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';

export class GetWalletPaymentsUseCase {
        constructor(private paymentRepository: IPaymentRepository) {}

        async Execute(walletId: string) {
                const payments =
                        await this.paymentRepository.findByWalletId(walletId);

                return payments.map((payment) => payment.getState());
        }
}

export const getWalletPaymentsUseCase = new GetWalletPaymentsUseCase(
        paymentRepository
);
