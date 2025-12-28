import { BusinessError } from '@src/shared/errors/BusinessError.js';
import { randomUUID } from 'crypto';
import { WalletStatus, WalletStatusType } from '../enums/DomainEnums.js';
import { InsufficientWalletBalanceError } from '../errors/domainErrors.js';

export interface WalletProps {
        readonly id: string;
        readonly userId: string;
        status: WalletStatusType;
        balanceKobo: number;
        reservedKobo: number;
        currency: string;
        version: number; // optimistic lock
        readonly createdAt: Date;
        updatedAt: Date;
}

export class Wallet {
        private constructor(private props: WalletProps) {
                if (props.balanceKobo !== 0) throw BusinessError.forbidden('Balance must start at Zero');
                if (props.reservedKobo !== 0)
                        throw BusinessError.forbidden('Reserved must start at zero');
        }

        /** Factory method to create a new Wallet Entity*/

        public static create(
                props: Omit<
                        WalletProps,
                        | 'id'
                        | 'balanceKobo'
                        | 'reservedKobo'
                        | 'status'
                        | 'version'
                        | 'createdAt'
                        | 'updatedAt'
                        | 'currency'
                >
        ): Wallet {
                return new Wallet({
                        id: randomUUID(),
                        balanceKobo: 0,
                        reservedKobo: 0,
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
                const MAX_SINGLE_FUND = 200_000 * 100; // Kobo
                if (amount > MAX_SINGLE_FUND)
                        throw BusinessError.forbidden('exceeds maximum single top-up');
                this.props.balanceKobo += amount;
                this.props.updatedAt = new Date();
                this.incrementVersion();
        }

        debit(amount: number) {
                if (this.props.status !== WalletStatus.ACTIVE)
                        throw BusinessError.forbidden('wallet not active');
                if (amount <= 0) throw BusinessError.forbidden('invalid amount');
                if (amount > this.availableAmount) throw BusinessError.forbidden('insufficient funds');
                this.props.balanceKobo -= amount;
                this.props.updatedAt = new Date();
                this.incrementVersion();
        }

        reserve(amount: number) {
                if (amount > this.availableAmount) throw BusinessError.forbidden('insufficient funds');
                this.props.balanceKobo -= amount;
                this.props.reservedKobo += amount;
                this.props.updatedAt = new Date();
                this.incrementVersion();
        }
        releaseReserved(amount: number) {
                if (amount > this.props.reservedKobo)
                        throw BusinessError.forbidden('insufficient funds in reserved');
                this.props.reservedKobo -= amount;
                this.props.updatedAt = new Date();
                this.incrementVersion();
        }

        checkBalance() {
                if (this.props.balanceKobo === 0) throw new InsufficientWalletBalanceError();
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

        get availableAmount() {
                return this.props.balanceKobo - this.props.reservedKobo;
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
