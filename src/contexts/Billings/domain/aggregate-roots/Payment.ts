import { randomUUID } from 'crypto';
import {
        PaymentStatus,
        PaymentStatusType,
        PaymentChannelType,
        PaymentDirection,
        PaymentDirectionType,
        PaymentProviderType
} from '../enums/DomainEnums.js';

import { InvalidPaymentStateError } from '../errors/domainErrors.js';

export interface PaymentProps {
        readonly id: string;
        readonly walletId: string;
        readonly systemReference: string;
        readonly provider: PaymentProviderType;
        readonly amountKobo: number;
        readonly currency: string;
        readonly direction: PaymentDirectionType;
        readonly channel: PaymentChannelType;
        status: PaymentStatusType;
        providerReference: string | null;
        cancelReason: string | null;
        readonly createdAt: Date;
        updatedAt: Date;
        metadata?: Record<string, any>;
}

export class Payment {
        private constructor(private props: PaymentProps) {}

        /** Factory method to create a new Payment Entity */
        public static create(
                props: Omit<
                        PaymentProps,
                        | 'id'
                        | 'createdAt'
                        | 'updatedAt'
                        | 'status'
                        | 'systemReference'
                        | 'providerReference'
                        | 'cancelReason'
                >
        ): Payment {
                return new Payment({
                        id: randomUUID(),
                        systemReference: this.generateSystemReference(),
                        providerReference: null,
                        cancelReason: null,
                        status: PaymentStatus.INITIATED,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...props
                });
        }

        /** Factory method to reconstitute a Payment from persistence */
        public static toEntity(data: PaymentProps): Payment {
                return new Payment({
                        ...data
                });
        }

        // ----- DOMAIN BEHAVIOURS -----

        private static generateSystemReference(): string {
                const timestamp = Date.now();
                const random = Math.random().toString(36).substring(2, 8).toUpperCase();
                return `PAY-${timestamp}-${random}`;
        }

        markAsCancelled(): void {
                this.props.status = PaymentStatus.CANCELLED;
                this.props.updatedAt = new Date();
        }

        updateMetadata(metadata: Record<string, any>): void {
                this.props.metadata = { ...this.props.metadata, ...metadata };
                this.props.updatedAt = new Date();
        }

        addProviderReference(providerReference: string): void {
                this.props.providerReference = providerReference;
        }

        markAsPending(providerReference: string): void {
                if (this.canMarkAsPending() === false) throw new InvalidPaymentStateError();

                this.props.status = PaymentStatus.PENDING;
                this.props.providerReference = providerReference;
                this.props.updatedAt = new Date();
        }

        markAsSuccess(): void {
                if (this.canMarkAsSuccess() === false) throw new InvalidPaymentStateError();
                this.props.status = PaymentStatus.SUCCESS;
                this.props.updatedAt = new Date();
        }

        markAsFailed(): void {
                if (this.canMarkAsFailed() === false) throw new InvalidPaymentStateError();
                this.props.status = PaymentStatus.FAILED;
                this.props.updatedAt = new Date();
        }

        cancel(reason?: string) {
                if (this.canBeCancelled() === false) {
                        throw new InvalidPaymentStateError();
                }
                this.props.status = PaymentStatus.CANCELLED;
                this.props.cancelReason = reason ?? null;
        }

        canMarkAsPending(): boolean {
                return this.props.status === PaymentStatus.INITIATED;
        }

        canMarkAsSuccess(): boolean {
                return (
                        this.props.status === PaymentStatus.PENDING ||
                        this.props.status === PaymentStatus.INITIATED
                );
        }

        canMarkAsFailed(): boolean {
                return this.props.status !== PaymentStatus.SUCCESS;
        }

        canBeCancelled(): boolean {
                return this.props.status === 'INITIATED' || this.props.status === 'PENDING';
        }

        isIncoming(): boolean {
                return this.props.direction === PaymentDirection.INCOMING;
        }

        isOutgoing(): boolean {
                return this.props.direction === PaymentDirection.OUTGOING;
        }

        isSuccessful(): boolean {
                return this.props.status === PaymentStatus.SUCCESS;
        }

        isPending(): boolean {
                return this.props.status === PaymentStatus.PENDING;
        }

        isFailed(): boolean {
                return this.props.status === PaymentStatus.FAILED;
        }

        isFromProvider(provider: PaymentProviderType): boolean {
                return this.props.provider === provider;
        }
        isFinalState() {
                return (
                        this.props.status === 'SUCCESS' ||
                        this.props.status === 'FAILED' ||
                        this.props.status === 'CANCELLED'
                );
        }

        getState(): PaymentProps {
                return { ...this.props };
        }

        // ----- GETTERS -----

        get id(): string {
                return this.props.id;
        }

        get status(): PaymentStatusType {
                return this.props.status;
        }

        get provider(): PaymentProviderType {
                return this.props.provider;
        }

        get systemReference(): string {
                return this.props.systemReference;
        }

        get providerReference(): string | null {
                return this.props.providerReference;
        }

        get direction(): PaymentDirectionType {
                return this.props.direction;
        }

        get channel(): PaymentChannelType {
                return this.props.channel;
        }

        get amountKobo(): number {
                return this.props.amountKobo;
        }

        get walletId(): string {
                return this.props.walletId;
        }
}
