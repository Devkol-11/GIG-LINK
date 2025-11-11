import { BusinessError } from "@src/shared/errors/BusinessError.js";
import { randomUUID } from "crypto";

export interface WalletProps {
  id: string;
  userId: string;
  balanceCents: number;
  reservedCents: number;
  version: number; // optimistic lock
  createdAt: Date;
  updatedAt: Date;
}

export class Wallet {
  private constructor(private readonly props: WalletProps) {
    if (props.balanceCents !== 0)
      throw BusinessError.forbidden("Balance must start at Zero");
    if (props.reservedCents !== 0)
      throw BusinessError.forbidden("Reserved must start at zero");
  }

  /** Factory method to create a new Wallet Entity*/

  public static create(
    props: Omit<
      WalletProps,
      | "id"
      | "balanceCents"
      | "reservedCents"
      | "version"
      | "createdAt"
      | "updatedAt"
    >
  ): Wallet {
    return new Wallet({
      id: randomUUID(),
      balanceCents: 0,
      reservedCents: 0,
      version: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  // ----- DOMAIN BEHAVIOURS -----

  fund(amount: number) {
    if (amount <= 0) throw BusinessError.forbidden("invalid amount");
    this.props.balanceCents += amount;
    this.props.updatedAt = new Date();
  }
  debit(amount: number) {
    if (amount > this.availableCents)
      throw BusinessError.forbidden("insufficient funds");
    this.props.balanceCents -= amount;
  }
  reserve(amount: number) {
    if (amount > this.availableCents)
      throw BusinessError.forbidden("insufficient funds");
    this.props.balanceCents -= amount;
    this.props.updatedAt = new Date();
  }
  releaseReserved(amount: number) {
    if (amount > this.props.reservedCents)
      throw BusinessError.forbidden("insufficient funds in reserved");
    this.props.reservedCents -= amount;
    this.props.balanceCents -= amount;
    this.props.updatedAt = new Date();
  }
  getState() {
    return { ...this.props };
  }

  // ----- GETTERS -----

  get availableCents() {
    return this.props.balanceCents - this.props.reservedCents;
  }
}
