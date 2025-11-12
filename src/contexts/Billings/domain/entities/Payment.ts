import { randomUUID } from "crypto";
import { readonly } from "zod";

export enum PaymentStatus {
  INITIATED = "INITIATED",
  PENDING = "PENDING",
  SUCCESS = " SUCCESS",
}

export interface PaymentProps {
  readonly id: String;
  readonly walledId: string;
  readonly userId: string;
  readonly provider: string;
  readonly amountCents: number;
  readonly currency: string;
  readonlystatus: PaymentStatus;
  readonly providerReference?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
