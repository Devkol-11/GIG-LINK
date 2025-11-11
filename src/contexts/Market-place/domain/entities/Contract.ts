import { randomUUID } from "crypto";

export enum ContractStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ContractPaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export type ContractProps = {
  id: string;
  gigId: string;
  applicationId: string;
  creatorId: string;
  freelancerId: string;
  startDate: Date;
  endDate: Date | null;
  status: ContractStatus;
  paymentStatus: ContractPaymentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class Contract {
  private constructor(private readonly props: ContractProps) {}

  /** Factory method to create a new Gig */

  public static create(
    props: Omit<
      ContractProps,
      "id" | "status" | "paymentStatus" | "createdAt" | "updatedAt"
    >
  ): Contract {
    return new Contract({
      id: randomUUID(),
      status: ContractStatus.ACTIVE,
      paymentStatus: ContractPaymentStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }
  // ----- DOMAIN BEHAVIOURS -----
  public markAsPaid() {
    this.props.paymentStatus = ContractPaymentStatus.PAID;
  }

  public markAsCompleted() {
    this.props.status = ContractStatus.COMPLETED;
  }

  public cancel() {
    this.props.status = ContractStatus.CANCELLED;
  }

  getState() {
    return { ...this.props };
  }
  // ----- GETTERS -----
  get id() {
    return this.props.id;
  }
  get gigId() {
    return this.props.gigId;
  }
  get applicationId() {
    return this.props.applicationId;
  }
  get creatorId() {
    return this.props.creatorId;
  }
  get freelancerId() {
    return this.props.freelancerId;
  }
  get status() {
    return this.props.status;
  }
  get paymentStatus() {
    return this.props.paymentStatus;
  }
}
