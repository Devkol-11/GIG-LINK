import { BusinessError } from "@src/shared/errors/BusinessError.js";
import { randomUUID } from "crypto";

export interface WalletProps {
  readonly id: string;
  readonly userId: string;
  balanceCents: number;
  reservedCents: number;
  currency: string;
  version: number; // optimistic lock
  readonly createdAt: Date;
  updatedAt: Date;
}

export class Wallet {
  private constructor(private props: WalletProps) {
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
      | "currency"
    >
  ): Wallet {
    return new Wallet({
      id: randomUUID(),
      balanceCents: 0,
      reservedCents: 0,
      version: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      currency: "NGN",
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
    this.props.reservedCents += amount;
    this.props.updatedAt = new Date();
  }
  releaseReserved(amount: number) {
    if (amount > this.props.reservedCents)
      throw BusinessError.forbidden("insufficient funds in reserved");
    this.props.reservedCents -= amount;
    this.props.updatedAt = new Date();
    this.incrementVersion();
  }

  // ----- PRIVATE METHODS -----

  private incrementVersion(): void {
    this.props.version += 1;
  }

  getState() {
    return { ...this.props };
  }

  public static toEntity(data: WalletProps): Wallet {
    return new Wallet({
      ...data,
    });
  }

  // ----- GETTERS -----

  get availableCents() {
    return this.props.balanceCents - this.props.reservedCents;
  }
  get id() {
    return this.props.id;
  }
}
