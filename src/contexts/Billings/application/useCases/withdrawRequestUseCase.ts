import { Payment } from '../../domain/entities/Payment.js';
import { PayoutAccount } from '../../domain/entities/PayoutAccount.js';
import { PaymentChannel, PaymentDirection, PaymentProvider } from '../../domain/enums/DomainEnums.js';
import { PayoutAccountError, WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { AccountNumber } from '../../domain/value-objects/AccountNumber.js';
import { BankCode } from '../../domain/value-objects/BankCode.js';
import { Money } from '../../domain/value-objects/Money.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IPayoutAccountRepository } from '../../ports/IPayoutAccountRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { WithdrawalRequestCommand } from '../dtos/WithdrawalDTO.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { paymentRepository } from '../../adapters/PaymentRepository.js';
import { payoutAccountRepository } from '../../adapters/PayoutAccountRepository.js';
import { unitOfWork } from '../../adapters/UnitOfWork.js';
import { paystackAdapter } from '../../adapters/PaystackAdapter.js';

export class WithdrawalRequestUseCase {
        constructor(
                private readonly walletRepository: IWalletRepository,
                private readonly paymentRepository: IPaymentRepository,
                private readonly payoutAccountRepository: IPayoutAccountRepository,
                private readonly unitOfWork: IUnitOfWork,
                private readonly paymentProvider: IPaymentProvider
        ) {}

        async execute(dto: WithdrawalRequestCommand) {
                let userId: string;
                let name: string;
                let accountNumber: string;
                let amount: number;
                let bankCode: string;

                userId = dto.userId;
                name = dto.name;
                accountNumber = dto.accountNumber;
                amount = dto.amount;
                bankCode = dto.bankCode;

                amount = Money.create(amount).getAmountInKobo();
                accountNumber = AccountNumber.create(accountNumber).getValue();
                bankCode = BankCode.create(bankCode).getValue();

                const wallet = await this.walletRepository.findByUserId(userId);

                if (!wallet) throw new WalletNotFoundError(); // should be systematically impossible - All users must have a wallet

                const payoutAccount = await this.payoutAccountRepository.findByUserId(userId);

                if (!payoutAccount) {
                        const response = await this.paymentProvider.getTransferRecepient({
                                type: 'nuban',
                                name,
                                accountNumber,
                                bankCode,
                                currency: 'NGN'
                        });

                        const payoutAccount = PayoutAccount.Create({
                                userId,
                                accountNumber: response.accountNumber,
                                code: response.recipientCode,
                                accountName: response.verifiedAccountName
                        });

                        await this.payoutAccountRepository.save(payoutAccount);
                }
                if (!payoutAccount?.code) throw new PayoutAccountError();

                const payment = Payment.create({
                        walletId: wallet.id,
                        amountKobo: amount,
                        provider: PaymentProvider.PAYSTACK,
                        currency: 'NGN',
                        direction: PaymentDirection.OUTGOING,
                        channel: PaymentChannel.TRANSFER
                });
                await this.paymentRepository.save(payment);

                const initResponse = await this.paymentProvider.initiateTransfer({
                        source: 'balance',
                        amount: payment.amountKobo,
                        reference: payment.systemReference,
                        recipient: payoutAccount.code
                });

                await this.unitOfWork.transaction(async (trx) => {
                        wallet.debit(payment.amountKobo);
                        payment.addProviderReference(initResponse.providerReference);
                        payment.markAsPending();
                        await this.walletRepository.save(wallet, trx);
                        await this.paymentRepository.save(payment, trx);
                });

                return {
                        status: initResponse.status,
                        message: initResponse.message
                };
        }
}

export const withdrawalRequestUseCase = new WithdrawalRequestUseCase(
        walletRepository,
        paymentRepository,
        payoutAccountRepository,
        unitOfWork,
        paystackAdapter
);
