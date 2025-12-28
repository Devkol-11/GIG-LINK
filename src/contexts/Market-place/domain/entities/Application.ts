import { randomUUID } from 'crypto';
import { ApplicationAcceptedEvent } from '../events/application.accepted.event.js';
import { ApplicationStatus, ApplicationStatusType } from '../enums/DomainEnums.js';

export type ApplicationProps = {
        readonly id: string;
        readonly gigId: string;
        readonly freelancerId: string;
        readonly creatorId: string;
        coverLetter: string;
        status: ApplicationStatusType;
        createdAt: Date;
        updatedAt: Date;
};

export class Application {
        private constructor(private readonly props: ApplicationProps) {}

        /** Factory method to create a new Application */
        public static create(
                props: Omit<ApplicationProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>
        ): Application {
                return new Application({
                        id: randomUUID(),
                        status: ApplicationStatus.PENDING,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...props
                });
        }

        // ----- DOMAIN BEHAVIOURS -----
        public accept() {
                this.props.status = ApplicationStatus.ACCEPTED;
                this.props.updatedAt = new Date();
                return new ApplicationAcceptedEvent(this.props.id, this.props.freelancerId);
        }
        public reject() {
                this.props.status = ApplicationStatus.REJECTED;
                this.props.updatedAt = new Date();
        }
        public withdraw() {
                this.props.status = ApplicationStatus.WITHDRAWN;
                this.props.updatedAt = new Date();
        }
        public updateStatus(updateStatus: ApplicationStatusType) {
                this.props.status = updateStatus;
        }
        public updateCoverLetter(coverLetter: string) {
                this.props.coverLetter = coverLetter;
                this.props.updatedAt = new Date();
        }

        getState() {
                return { ...this.props };
        }
        public static toEntity(data: ApplicationProps): Application {
                return new Application({
                        ...data
                });
        }
        // ----- GETTERS -----
        get id() {
                return this.props.id;
        }
        get gigId() {
                return this.props.gigId;
        }
        get freelancerId() {
                return this.props.freelancerId;
        }
        get creatorId() {
                return this.props.creatorId;
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
