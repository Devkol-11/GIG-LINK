import { PaymentRepository, paymentRepository } from '../../adapters/PaymentRepository.js';

export class ListWalletPaymentUseCase {
        constructor(private readonly paymentRepository: PaymentRepository) {}

        async Execute(walletId: string) {
                const payments = await this.paymentRepository.findAllByWalletId(walletId);

                return payments.map((p) => p.getState());
        }
}

export const listWalletPaymentsUseCase = new ListWalletPaymentUseCase(paymentRepository);
