import { Transaction } from "../domain/entities/Transsactions.js";

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByWalletId(walletId: string): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  findByPaymentId(paymentId: string): Promise<Transaction[]>;
}
