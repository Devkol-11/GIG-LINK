import { IWalletRepository } from "../../ports/IWalletRepository.js";
import { walletRepository } from "../../infrastructure/WalletRepository.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

export class ReleaseReservedFundsUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async Execute(walletId: string, amount: number) {
    const wallet = await this.walletRepository.findById(walletId);
    if (!wallet) throw BusinessError.notFound("Wallet not found");

    wallet.releaseReserved(amount);
    await this.walletRepository.updateWithVersion(wallet);

    return wallet.getState();
  }
}

export const releaseReservedFundsUseCase = new ReleaseReservedFundsUseCase(
  walletRepository
);
