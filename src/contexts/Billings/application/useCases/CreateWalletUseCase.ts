import { walletRepository } from "../../infrastructure/WalletRepository.js";
import { IWalletRepository } from "../../ports/IWalletRepository.js";
import { Wallet } from "../../domain/entities/Wallet.js";
import { BusinessError } from "@src/shared/errors/BusinessError.js";

export class CreateWalletUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async Execute(userId: string) {
    // Check if wallet already exists
    const existing = await this.walletRepository.findByUserId(userId);
    if (existing) throw new BusinessError("Wallet already exists for user");

    const wallet = Wallet.create({
      userId,
    });

    const saved = await this.walletRepository.save(wallet);

    return saved.getState();
  }
}

export const createWalletUseCase = new CreateWalletUseCase(walletRepository);
