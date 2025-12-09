import { randomUUID } from 'crypto';
import { EscrowTransaction } from './EscrowTransaction.js';
import { EscrowRelease } from './EscrowRelease.js';
import { EscrowDispute } from './EscrowDispute.js';
import { BusinessError } from '@src/shared/errors/BusinessError.js';

export enum EscrowStatus {
        HELD = 'HELD',
        RELEASED = 'RELEASED',
        DISPUTED = 'DISPUTED',
        CLOSED = 'CLOSED'
}

export interface EscrowAccountProps {
        readonly id: string;
        readonly contractId: string;
        readonly creatorId: string;
        readonly freelancerId: string;
        _balanceCents: number;
        _status: EscrowStatus;
        _locked: boolean;
        readonly currency: string;
        readonly createdAt: Date;
        updatedAt: Date;

        transactions: EscrowTransaction[];
        releases: EscrowRelease[];
        disputes: EscrowDispute[];
}

export class EscrowAccount {
        private constructor(private props: EscrowAccountProps) {}

        public static create(
                props: Omit<
                        EscrowAccountProps,
                        'id' | 'createdAt' | 'updatedAt'
                >
        ): EscrowAccount {
                return new EscrowAccount({
                        id: randomUUID(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...props
                });
        }

        // ----- DOMAIN BEHAVIOURS -----

        fund(amount: number) {
                if (amount <= 0)
                        throw BusinessError.forbidden(
                                'Amount must be greater then zero'
                        );
                this.props._balanceCents += amount;
                this.props.updatedAt = new Date();
        }

        release(amount: number) {
                if (this.props._locked === true)
                        throw BusinessError.forbidden(
                                'cannot realse funds , escrow account is locked'
                        );
                if (amount > this.props._balanceCents)
                        BusinessError.forbidden(
                                'insufficient funds in escrow account'
                        );
                this.props._balanceCents -= amount;
        }
        lock() {
                this.props._locked = true;
        }
        unlock() {
                this.props._locked = false;
        }
        markAsDisputed() {
                this.props._status = EscrowStatus.DISPUTED;
                this.props._locked = true;
        }
        close() {
                this.props._status = EscrowStatus.CLOSED;
        }

        getState() {
                return { ...this.props };
        }
        // ----- GETTERS -----
        get balance() {
                return this.props._balanceCents;
        }
        get status() {
                return this.props._status;
        }
        get locked() {
                return this.props._locked;
        }
}
