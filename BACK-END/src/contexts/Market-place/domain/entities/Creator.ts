import { randomUUID } from "crypto";

export type CreatorProps = {
  id: string;
  userId: string;
  organizationName: string | null;
  rating: number;
  totalGigsPosted: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class Creator {
  private constructor(private readonly props: CreatorProps) {}

  /** Factory method to create a new Gig */

  public static create(
    props: Omit<CreatorProps, "id" | "rating" | "totalGigsPosted" | "verified">
  ): Creator {
    return new Creator({
      id: randomUUID(),
      rating: 0,
      totalGigsPosted: 0,
      verified: false,
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // ----- DOMAIN BEHAVIOURS -----

  public verifyCreator() {
    this.props.verified = true;
  }

  getState() {
    return { ...this.props };
  }
  // ----- GETTERS -----
  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get organizationName() {
    return this.props.organizationName;
  }
  get rating() {
    return this.props.rating;
  }
  get totalGigsPosted() {
    return this.props.totalGigsPosted;
  }
  get verified() {
    return this.props.verified;
  }
}
