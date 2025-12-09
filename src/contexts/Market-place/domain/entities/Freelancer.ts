import { randomUUID } from 'crypto';
import { GigConflict } from '../errors/DomainErrors.js';

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
                props: Omit<
                        FreelancerProps,
                        | 'id'
                        | 'rating'
                        | 'totalJobs'
                        | 'verified'
                        | 'createdAt'
                        | 'updatedAt'
                >
        ): Freelancer {
                return new Freelancer({
                        id: randomUUID(),
                        rating: 0,
                        totalJobs: 0,
                        verified: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...props
                });
        }

        // ----- DOMAIN BEHAVIOURS -----

        public verifyFreelancer() {
                this.props.verified = true;
        }

        public canApplyForGig(): boolean {
                if (this.props.verified === false)
                        throw new GigConflict(
                                'must be a verified user to accept gigs'
                        );

                if (this.props.totalJobs > 5)
                        throw new GigConflict(
                                'Too many gigs at the moment , complete unfinished gigd to accept new gigs'
                        );
                return true;
        }

        getState() {
                return { ...this.props };
        }
        public static toEntity(data: FreelancerProps): Freelancer {
                return new Freelancer({
                        ...data
                });
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
