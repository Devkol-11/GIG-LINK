import { randomUUID } from 'crypto';
import { EscrowStatus, EscrowStatusType } from '../enums/DomainEnums.js';
import { InvalidEscrowStateError } from '../errors/domainErrors.js';

export interface EscrowAccountProps {
        readonly id: string;
        readonly contractId: string;
        readonly creatorId: string;
        readonly freelancerId: string;
        balanceKobo: number;
        expectedAmountKobo: number;
        currency: string;
        status: EscrowStatusType;
        locked: boolean;
        readonly createdAt: Date;
        updatedAt: Date;
}

export class EscrowAccount {
        private constructor(private props: EscrowAccountProps) {}

        /** Factory method to create a new EscrowAccount */
        public static Create(
                props: Omit<
                        EscrowAccountProps,
                        'id' | 'status' | 'locked' | 'createdAt' | 'updatedAt' | 'currency'
                >
        ): EscrowAccount {
                return new EscrowAccount({
                        id: randomUUID(),
                        status: EscrowStatus.HELD,
                        locked: true,
                        currency: 'NGN',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...props
                });
        }

        /** Reconstitute from persistence */
        public static toEntity(data: EscrowAccountProps): EscrowAccount {
                return new EscrowAccount({ ...data });
        }

        // ----- DOMAIN BEHAVIORS -----

        fund(amountKobo: number): void {
                if (amountKobo <= 0)
                        throw new InvalidEscrowStateError('Cannot fund with zero or negative amount');
                if (this.props.locked === false) throw new InvalidEscrowStateError('Escrow is unlocked');

                if (this.props.balanceKobo + amountKobo !== this.props.expectedAmountKobo)
                        throw new InvalidEscrowStateError(
                                'Escrow must be funded with exact contract amount'
                        );

                this.props.balanceKobo += amountKobo;
                this.props.updatedAt = new Date();
        }

        release() {
                if (!this.props.locked) throw new InvalidEscrowStateError('Escrow must be locked');

                this.props.status = EscrowStatus.RELEASED;
                this.props.locked = false;

                const payout = this.props.balanceKobo;
                this.props.balanceKobo = 0;
                this.props.updatedAt = new Date();

                return payout;
        }

        lock(): void {
                this.props.locked = true;
                this.props.updatedAt = new Date();
        }

        unlock(): void {
                this.props.locked = false;
                this.props.updatedAt = new Date();
        }

        getState(): EscrowAccountProps {
                return { ...this.props };
        }

        // ----- GETTERS -----
        get id(): string {
                return this.props.id;
        }
        get status(): EscrowStatusType {
                return this.props.status;
        }
        get locked(): boolean {
                return this.props.locked;
        }
        get creatorId(): string {
                return this.props.creatorId;
        }
        get freeLancerId(): string {
                return this.props.freelancerId;
        }
        get balance(): number {
                return this.props.balanceKobo;
        }
}
