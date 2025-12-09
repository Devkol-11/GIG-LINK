import { BusinessError } from '@src/shared/errors/BusinessError.js';
import { randomUUID } from 'crypto';
import { WalletStatus, WalletStatusType } from '../enums/DomainEnums.js';

export interface WalletProps {
        readonly id: string;
        readonly userId: string;
        status: WalletStatusType;
        balanceCents: number;
        reservedCents: number;
        currency: string;
        version: number; // optimistic lock
        readonly createdAt: Date;
        updatedAt: Date;
}

export class Wallet {
        private constructor(private props: WalletProps) {
                if (props.balanceCents !== 0)
                        throw BusinessError.forbidden('Balance must start at Zero');
                if (props.reservedCents !== 0)
                        throw BusinessError.forbidden('Reserved must start at zero');
        }

        /** Factory method to create a new Wallet Entity*/

        public static create(
                props: Omit<
                        WalletProps,
                        | 'id'
                        | 'balanceCents'
                        | 'reservedCents'
                        | 'status'
                        | 'version'
                        | 'createdAt'
                        | 'updatedAt'
                        | 'currency'
                >
        ): Wallet {
                return new Wallet({
                        id: randomUUID(),
                        balanceCents: 0,
                        reservedCents: 0,
                        version: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        currency: 'NGN',
                        status: WalletStatus.ACTIVE,
                        ...props
                });
        }

        // ----- DOMAIN BEHAVIOURS -----

        fund(amount: number) {
                if (this.props.status !== WalletStatus.ACTIVE)
                        throw BusinessError.forbidden('wallet not active');
                if (amount <= 0) throw BusinessError.forbidden('invalid amount');
                // max single deposit (domain rule)
                const MAX_SINGLE_FUND = 200_000 * 100; // cents
                if (amount > MAX_SINGLE_FUND)
                        throw BusinessError.forbidden('exceeds maximum single top-up');
                this.props.balanceCents += amount;
                this.props.updatedAt = new Date();
                this.incrementVersion();
        }

        debit(amount: number) {
                if (this.props.status !== WalletStatus.ACTIVE)
                        throw BusinessError.forbidden('wallet not active');
                if (amount <= 0) throw BusinessError.forbidden('invalid amount');
                if (amount > this.availableCents)
                        throw BusinessError.forbidden('insufficient funds');
                this.props.balanceCents -= amount;
                this.props.updatedAt = new Date();
                this.incrementVersion();
        }

        reserve(amount: number) {
                if (amount > this.availableCents)
                        throw BusinessError.forbidden('insufficient funds');
                this.props.balanceCents -= amount;
                this.props.reservedCents += amount;
                this.props.updatedAt = new Date();
                this.incrementVersion();
        }
        releaseReserved(amount: number) {
                if (amount > this.props.reservedCents)
                        throw BusinessError.forbidden('insufficient funds in reserved');
                this.props.reservedCents -= amount;
                this.props.updatedAt = new Date();
                this.incrementVersion();
        }

        // ----- PRIVATE METHODS -----

        private incrementVersion(): void {
                this.props.version += 1;
        }

        getState() {
                return { ...this.props };
        }

        public static toEntity(data: WalletProps): Wallet {
                return new Wallet({
                        ...data
                });
        }

        // ----- GETTERS -----

        get availableCents() {
                return this.props.balanceCents - this.props.reservedCents;
        }
        get id() {
                return this.props.id;
        }
        get userId() {
                return this.props.userId;
        }
        get status() {
                return this.props.status;
        }
        get currency() {
                return this.props.currency;
        }
}
