import { randomUUID } from "crypto";
import { BusinessError } from "../errors/BusinessError.js";

export enum GigStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export type GigProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  deadline: Date | null;
  status: GigStatus;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
};

export class Gig {
  private constructor(private readonly props: GigProps) {}

  /** Factory method to create a new Gig */

  public static create(
    props: Omit<GigProps, "id" | "status" | "createdAt" | "updatedAt">
  ): Gig {
    if (!props.title || !props.description) {
      throw new BusinessError("Gig must have a title and description.");
    }

    return new Gig({
      id: randomUUID(),
      status: GigStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  // ----- DOMAIN BEHAVIOURS -----
  public activate() {
    if (this.props.status !== GigStatus.DRAFT) {
      throw new BusinessError("Only drafts can be activated.");
    }
    this.props.status = GigStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  public complete() {
    if (this.props.status !== GigStatus.ACTIVE) {
      throw new BusinessError("Only active gigs can be completed.");
    }
    this.props.status = GigStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }

  public cancel() {
    if (this.props.status === GigStatus.COMPLETED) {
      throw new BusinessError("Completed gigs cannot be cancelled.");
    }
    this.props.status = GigStatus.CANCELLED;
    this.props.updatedAt = new Date();
  }

  public getState() {
    return { ...this.props };
  }

  // ----- GETTERS -----
  get id() {
    return this.props.id;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get category() {
    return this.props.category;
  }
  get tags() {
    return this.props.tags;
  }
  get price() {
    return this.props.price;
  }
  get deadline() {
    return this.props.deadline;
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
  get creatorId() {
    return this.props.creatorId;
  }
}
