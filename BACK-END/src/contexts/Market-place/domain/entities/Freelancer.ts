import { randomUUID } from "crypto";

export type FreelancerProps = {
  id: string;
  userId: string;
  skills: string[];
  bio: string | null;
  rating: number;
  totalJobs: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class Freelancer {
  private constructor(private readonly props: FreelancerProps) {}

  /** Factory method to create a new Gig */

  public static create(
    props: Omit<FreelancerProps, "id" | "rating" | "totalJobs" | "verified">
  ): Freelancer {
    return new Freelancer({
      id: randomUUID(),
      rating: 0,
      totalJobs: 0,
      verified: false,
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // ----- DOMAIN BEHAVIOURS -----

  public verifyFreelancer() {
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
  get skills() {
    return this.props.skills;
  }
  get bio() {
    return this.props.bio;
  }
  get rating() {
    return this.props.rating;
  }
  get totalJobs() {
    return this.props.totalJobs;
  }
  get verified() {
    return this.props.verified;
  }
}
