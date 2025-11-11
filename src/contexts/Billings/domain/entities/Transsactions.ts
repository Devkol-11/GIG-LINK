import { randomUUID } from "crypto";

export interface TransactionProps {
  id: string;
  walletId: string;
  transactionType:
    | "CREDIT"
    | "DEBIT"
    | "RESERVE"
    | "RELEASE"
    | "REFUND"
    | "REVERSAL";
  amountCents: number;
  status: "PENDING" | "FALIED" | "SUCCESS";
  reference?: string; // idempotency
  source: "USER" | "SYSTEM" | "ESCROW" | "EXTERNAL_PAYMENT";
  paymentId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export class Transaction {
  private constructor(private readonly props: TransactionProps) {}

  /** Factory method to create a new Transaction Entity */

  public static create(
    props: Omit<TransactionProps, "id" | "createdAt">
  ): Transaction {
    return new Transaction({
      id: randomUUID(),
      createdAt: new Date(),
      ...props,
    });
  }

  // ----- DOMAIN BEHAVIOURS -----

  getState() {
    return { ...this.props };
  }
}
