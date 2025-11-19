import { ITransactionRepository } from "../../ports/ITransactionRepository.js";
import { transactionRepository } from "../../infrastructure/TransactionRepository.js";

export class GetTransactionsByPaymentUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async Execute(paymentId: string) {
    const transactions = await this.transactionRepository.findByPaymentId(
      paymentId
    );

    return transactions.map((tx) => tx.getState());
  }
}

export const getTransactionsByPaymentUseCase =
  new GetTransactionsByPaymentUseCase(transactionRepository);
