import { randomUUID } from 'crypto';
export enum EscrowDisputeStatus {
        OPEN = 'OPEN',
        IN_REVIEW = 'IN_REVIEW',
        RESOLVED = 'RESOLVED',
        CLOSED = 'CLOSED'
}

interface EscrowDisputeProps {
        readonly id: string;
        readonly escrowId: string;
        readonly raisedById: string;
        readonly reason: string;
        _status: EscrowDisputeStatus;
        _resolution?: string;
        _resolvedById?: string;
        readonly createdAt: Date;
        _resolvedAt?: Date;
}

export class EscrowDispute {
        private constructor(private props: EscrowDisputeProps) {}

        public static create(
                props: Omit<
                        EscrowDisputeProps,
                        'id' | 'createdAt' | '_resolvedAt'
                >
        ): EscrowDispute {
                return new EscrowDispute({
                        id: randomUUID(),
                        createdAt: new Date(),
                        _resolvedAt: new Date(),
                        ...props
                });
        }

        // ----- DOMAIN BEHAVIOURS -----
        resolve(resolution: string, resolvedById: string) {
                if (this.props._status === EscrowDisputeStatus.RESOLVED)
                        throw new Error('Dispute already resolved');
                this.props._status = EscrowDisputeStatus.RESOLVED;
                this.props._resolution = resolution;
                this.props._resolvedById = resolvedById;
                this.props._resolvedAt = new Date();
        }

        getState() {
                return { ...this.props };
        }

        get status() {
                return this.props._status;
        }
}
