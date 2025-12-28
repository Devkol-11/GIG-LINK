import { randomUUID } from 'crypto';
import { EscrowTransactionType } from '../enums/DomainEnums.js';
import { TransactionStatus, TransactionStatusType } from '../enums/DomainEnums.js';

export interface EscrowTransactionProps {
        readonly id: string;
        readonly escrowId: string;
        type: EscrowTransactionType;
        amountKobo: number;
        reference?: string | null;
        status: TransactionStatusType;
        description?: string | null;
        readonly createdAt: Date;
}

export class EscrowAccountTransaction {
        private constructor(private props: EscrowTransactionProps) {}

        /** Factory method to create a new EscrowTransaction */
        public static Create(
                props: Omit<EscrowTransactionProps, 'id' | 'status' | 'createdAt'>
        ): EscrowAccountTransaction {
                return new EscrowAccountTransaction({
                        id: randomUUID(),
                        status: TransactionStatus.SUCCESS,
                        createdAt: new Date(),
                        ...props
                });
        }

        /** Reconstitute from persistence */
        public static toEntity(data: EscrowTransactionProps): EscrowAccountTransaction {
                return new EscrowAccountTransaction({ ...data });
        }

        // ----- DOMAIN BEHAVIORS -----
        markAsSuccess(): void {
                this.props.status = TransactionStatus.SUCCESS;
        }

        markAsFailed(): void {
                this.props.status = TransactionStatus.FAILED;
        }

        getState(): EscrowTransactionProps {
                return { ...this.props };
        }

        // ----- GETTERS -----
        get id(): string {
                return this.props.id;
        }
        get escrowId(): string {
                return this.props.escrowId;
        }
        get amount(): number {
                return this.props.amountKobo;
        }
        get type(): EscrowTransactionType {
                return this.props.type;
        }
        get status(): TransactionStatusType {
                return this.props.status;
        }
}
