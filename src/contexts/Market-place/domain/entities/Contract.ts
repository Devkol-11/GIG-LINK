import { randomUUID } from 'crypto';
import {
        ContractStatus,
        ContractPaymentStatus,
        ContractStatusType,
        ContractPaymentStatusType
} from '../enums/DomainEnums.js';

export type ContractProps = {
        id: string;
        gigId: string;
        applicationId: string;
        creatorId: string;
        freelancerId: string;
        startDate: Date;
        endDate: Date | null;
        status: ContractStatusType;
        paymentStatus: ContractPaymentStatusType;
        createdAt: Date;
        updatedAt: Date;
};

export class Contract {
        private constructor(private readonly props: ContractProps) {}

        /** Factory method to create a new Gig */

        public static create(
                props: Omit<
                        ContractProps,
                        | 'id'
                        | 'status'
                        | 'paymentStatus'
                        | 'createdAt'
                        | 'updatedAt'
                >
        ): Contract {
                return new Contract({
                        id: randomUUID(),
                        status: ContractStatus.ACTIVE,
                        paymentStatus: ContractPaymentStatus.PENDING,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...props
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
        public static toEntity(data: ContractProps): Contract {
                return new Contract({
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
