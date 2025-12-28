import { escrowAccountRepository } from '../../adapters/EscrowAccountRepository.js';
import { escrowAccountTransactionRepository } from '../../adapters/EscrowAccountTransactionRepository.js';
import { unitOfWork } from '../../adapters/UnitOfWork.js';
import { walletRepository } from '../../adapters/WalletRepository.js';
import { EscrowAccountTransaction } from '../../domain/entities/EscrowTransaction.js';
import { EscrowTransaction } from '../../domain/enums/DomainEnums.js';
import {
        EscrowNotFoundError,
        UnauthorizedAccessError,
        WalletNotFoundError
} from '../../domain/errors/domainErrors.js';
import { IEscrowAccountRepository } from '../../ports/IEscrowAccountRepository.js';
import { IEscrowAccountTransactionRepository } from '../../ports/IEscrowAccountTransaction.js';
import { IUnitOfWork } from '../../ports/IUnitOfWork.js';
import { IWalletRepository } from '../../ports/IWalletRepository.js';

export class ReleaseEscrowUseCase {
        constructor(
                private readonly escrowAccountRepository: IEscrowAccountRepository,
                private readonly escrowAccountTransactionRepository: IEscrowAccountTransactionRepository,
                private readonly walletRepository: IWalletRepository,
                private readonly unitOfWork: IUnitOfWork
        ) {}

        async execute(escrowId: string, userId: string) {
                const escrowAccount = await this.escrowAccountRepository.findByid(escrowId);

                if (!escrowAccount) throw new EscrowNotFoundError();

                if (userId !== escrowAccount.creatorId) throw new UnauthorizedAccessError();

                const payout = escrowAccount.release();

                const freelancerId = escrowAccount.freeLancerId;

                const freelancerWallet = await this.walletRepository.findByUserId(freelancerId);

                if (!freelancerWallet) throw new WalletNotFoundError();

                freelancerWallet.fund(payout);

                const escrowAccountTransaction = EscrowAccountTransaction.Create({
                        escrowId: escrowAccount.id,
                        type: EscrowTransaction.RELEASE,
                        amountKobo: payout
                });

                await this.unitOfWork.transaction(async (trx) => {
                        await this.walletRepository.save(freelancerWallet, trx);
                        await this.escrowAccountTransactionRepository.save(escrowAccountTransaction, trx);
                });
        }
}

export const releaseEscrowUseCase = new ReleaseEscrowUseCase(
        escrowAccountRepository,
        escrowAccountTransactionRepository,
        walletRepository,
        unitOfWork
);
