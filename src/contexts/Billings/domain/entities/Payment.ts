import { randomUUID } from "crypto";

export interface PaymentProps {
  id: String;
  walledId: string;
  userId: string;
  provider: string;
  amountCents: number;
  currency: string;
  status: "INITIATED" | "PENDING" | "SUCCESS";
  providerReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment {
  private constructor(private readonly props: PaymentProps) {}

  /** Factory method to create a new Payment Entity */

  create(props: Omit<PaymentProps, "id" | "createdAt" | "updatedAt">): Payment {
    return new Payment({
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  // ----- DOMAIN BEHAVIOURS -----

  getState() {
    return { ...this.props };
  }
}
