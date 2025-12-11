import { WalletRepository } from '../../adapters/WalletRepository.js';
import { WalletNotFoundError } from '../../domain/errors/domainErrors.js';
import { AccountNumber } from '../../domain/value-objects/AccountNumber.js';
import { BankCode } from '../../domain/value-objects/BankCode.js';
import { Money } from '../../domain/value-objects/Money.js';
import { IPaymentProvider } from '../../ports/IPaymentProvider.js';
import { IPaymentRepository } from '../../ports/IPaymentRepository.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { clientWithdrawalRequestCommand } from '../dtos/withdrawalRequest.js';

export class WithdrawalRequestUseCase {
        constructor(
                private readonly walletRepository: IWalletRepository,
                private readonly paymentRepository: IPaymentRepository,
                private readonly paymentProvider: IPaymentProvider
        ) {}

        async Execute(dto: clientWithdrawalRequestCommand) {
                let userId;
                let name;
                let accountNumber;
                let amount;
                let bankCode;

                userId = dto.userId;
                name = dto.name;
                accountNumber = dto.accountNumber;
                amount = dto.amount;
                bankCode = dto.bankCode;

                amount = Money.create(amount).getAmountInKobo();
                accountNumber = AccountNumber.create(accountNumber).getValue();
                bankCode = BankCode.create(bankCode).getValue();

                const wallet = await this.walletRepository.findById(userId);

                if (!wallet) throw new WalletNotFoundError(); // should be systematically impossible - All users must have a wallet

                const response = await this.paymentProvider.getTransferRecepient({
                        type: 'nuban',
                        name,
                        accountNumber,
                        bankCode,
                        currency: 'NGN'
                });

                // WE STOPPED AT THE PAYMENT RECEPIENT REPO - delibrating if i should create an entity for it , or a dumb data bag
        }
}
