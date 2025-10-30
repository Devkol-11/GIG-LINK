import { randomUUID } from "crypto";

export enum ApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export type ApplicationProps = {
  id: string;
  gigId: string;
  freelancerId: string;
  coverLetter: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class Application {
  private constructor(private readonly props: ApplicationProps) {}

  /** Factory method to create a new Application */
  public static create(
    props: Omit<ApplicationProps, "id" | "status" | "createdAt" | "updatedAt">
  ): Application {
    return new Application({
      id: randomUUID(),
      status: ApplicationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  // ----- DOMAIN BEHAVIOURS -----
  public accept() {
    this.props.status = ApplicationStatus.ACCEPTED;
    this.props.updatedAt = new Date();
  }
  public reject() {
    this.props.status = ApplicationStatus.REJECTED;
    this.props.updatedAt = new Date();
  }
  public withdraw() {
    this.props.status = ApplicationStatus.WITHDRAWN;
    this.props.updatedAt = new Date();
  }

  // Returns persistence-ready plain object
  getState() {
    return { ...this.props };
  }

  // ----- GETTERS (one-liners) -----
  get id() {
    return this.props.id;
  }
  get gigId() {
    return this.props.gigId;
  }
  get freelancerId() {
    return this.props.freelancerId;
  }
  get coverLetter() {
    return this.props.coverLetter;
  }
  get status() {
    return this.props.status;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
