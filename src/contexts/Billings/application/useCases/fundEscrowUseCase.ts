import { EscrowTransactionType } from 'prisma/generated/prisma/enums.js';
import { EscrowAccountTransaction } from '../../domain/entities/EscrowTransaction.js';
import { EscrowTransaction } from '../../domain/enums/DomainEnums.js';
import {
        EscrowNotFoundError,
        InsufficientWalletBalanceError,
        UnauthorizedAccessError,
        WalletNotFoundError
} from '../../domain/errors/domainErrors.js';
import { IEscrowAccountRepository } from '../../ports/IEscrowAccountRepository.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';
import { IEscrowAccountTransactionRepository } from '../../ports/IEscrowAccountTransaction.js';
import { escrowAccountRepository } from '../../adapters/EscrowAccountRepository.js';
import { escrowAccountTransactionRepository } from '../../adapters/EscrowAccountTransactionRepository.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { unitOfWork } from '../../adapters/UnitOfWork.js';

export class FundEscrowAccountUsecase {
        constructor(
                private readonly escrowAccountRepository: IEscrowAccountRepository,
                private readonly escrowAccountTransactionRepository: IEscrowAccountTransactionRepository,
                private readonly walletRepository: IWalletRepository,
                private readonly unitOfWork: IUnitOfWork
        ) {}

        async execute(escrowId: string, amount: number, userId: string) {
                const escrowAccount = await this.escrowAccountRepository.findByid(escrowId);

                if (!escrowAccount) throw new EscrowNotFoundError();

                const creatorId = escrowAccount.creatorId;
                if (userId !== creatorId) throw new UnauthorizedAccessError();

                const creatorWallet = await this.walletRepository.findByUserId(creatorId);
                if (!creatorWallet) throw new WalletNotFoundError();

                creatorWallet.checkBalance();

                if (creatorWallet.availableAmount < amount) throw new InsufficientWalletBalanceError();

                await this.unitOfWork.transaction(async (trx) => {
                        creatorWallet.debit(amount);
                        escrowAccount.fund(amount);

                        await this.walletRepository.save(creatorWallet, trx);
                        await this.escrowAccountRepository.save(escrowAccount, trx);

                        const escrowAccountTransaction = EscrowAccountTransaction.Create({
                                escrowId: escrowAccount.id,
                                type: EscrowTransactionType.FUND,
                                amountKobo: amount
                        });

                        await this.escrowAccountTransactionRepository.save(escrowAccountTransaction, trx);
                });

                return { message: 'escrow funded successfully' };
        }
}

export const fundEscrowAccountUseCase = new FundEscrowAccountUsecase(
        escrowAccountRepository,
        escrowAccountTransactionRepository,
        walletRepository,
        unitOfWork
);
