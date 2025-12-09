import { randomUUID } from 'crypto';
export enum EscrowTransactionType {
        FUND = 'FUND',
        RELEASE = 'RELEASE',
        REFUND = 'REFUND',
        ADJUSTMENT = 'ADJUSTMENT'
}

export enum TransactionStatus {
        PENDING = 'PENDING',
        SUCCESS = 'SUCCESS',
        FAILED = 'FAILED'
}

interface EscrowTransactionProps {
        readonly id: string;
        readonly escrowId: string;
        readonly type: EscrowTransactionType;
        readonly amountCents: number;
        readonly reference?: string;
        readonly status: TransactionStatus;
        readonly description?: string;
        readonly meta?: Record<string, any>;
        readonly createdAt: Date;
}

export class EscrowTransaction {
        private constructor(private props: EscrowTransactionProps) {}

        public static create(
                props: Omit<EscrowTransactionProps, 'id' | 'createdAt'>
        ): EscrowTransaction {
                return new EscrowTransaction({
                        id: randomUUID(),
                        createdAt: new Date(),
                        ...props
                });
        }

        getState() {
                return { ...this.props };
        }
}
