import { randomUUID } from 'crypto';
import {
        TransactionType_Type,
        TransactionStatusType,
        TransactionSourceType,
        TransactionType,
        TransactionStatus
} from '../enums/DomainEnums.js';

export type TransactionMetadata = string | number | boolean | Record<string, any> | any[] | null;

export interface TransactionProps {
        readonly id: string;
        readonly walletId: string;
        paymentId: string;
        transactionType: TransactionType_Type;
        amountKobo: number;
        status: TransactionStatusType;
        systemReference: string; // idempotency
        providerReference: string;
        description: string | null;
        source: TransactionSourceType;
        metadata: TransactionMetadata;
        createdAt: Date;
}

export class Transaction {
        private constructor(private props: TransactionProps) {}

        /** Factory method to create a new Transaction Entity */
        public static create(
                props: Omit<TransactionProps, 'id' | 'createdAt' | 'systemReference'>
        ): Transaction {
                return new Transaction({
                        id: randomUUID(),
                        createdAt: new Date(),
                        systemReference: this.generateSystemReference(),
                        ...props
                });
        }

        static pendingWithdrawal(props: Omit<TransactionProps, 'transactionType' | 'status'>) {
                return Transaction.create({
                        transactionType: TransactionType.DEBIT,
                        status: TransactionStatus.PENDING,
                        ...props
                });
        }

        public static toEntity(data: TransactionProps): Transaction {
                return new Transaction({ ...data });
        }

        private static generateSystemReference(): string {
                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(2, 9);
                return `GIG-${timestamp}-${random}`;
        }

        public addProviderReference(providerReference: string) {
                this.props.providerReference = providerReference;
        }

        // ----- DOMAIN BEHAVIOURS -----
        getState() {
                return { ...this.props };
        }

        get id() {
                return this.props.id;
        }

        get providerReference() {
                return this.props.providerReference;
        }
}
