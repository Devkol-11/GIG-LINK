import { randomUUID } from 'crypto';
export enum EscrowReleaseType {
        PARTIAL = 'PARTIAL',
        FULL = 'FULL',
        MILESTONE = 'MILESTONE'
}

interface EscrowReleaseProps {
        readonly id: string;
        readonly escrowId: string;
        readonly amountCents: number;
        readonly releaseType: EscrowReleaseType;
        readonly approvedBy?: string;
        readonly releasedAt: Date;
        readonly notes?: string;
        readonly transactionId?: string;
        readonly meta?: Record<string, any>;
}

export class EscrowRelease {
        private constructor(private props: EscrowReleaseProps) {}

        public static create(
                props: Omit<EscrowReleaseProps, 'id' | 'releasedAt'>
        ): EscrowRelease {
                return new EscrowRelease({
                        id: randomUUID(),
                        releasedAt: new Date(),
                        ...props
                });
        }

        getState() {
                return { ...this.props };
        }
}
