import { Wallet } from "../domain/entities/Wallet.js";

export interface IWalletRepository {
  findById(id: string): Promise<Wallet | null>;
  findByUserId(userId: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<Wallet>;
  updateWithVersion(wallet: Wallet): Promise<Wallet>;
  updateBalance(walletId: string, amount: number): Promise<Wallet>;
}
