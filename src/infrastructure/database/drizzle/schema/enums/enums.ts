// schemas/enums.ts
import { pgEnum } from 'drizzle-orm/pg-core';

// User role enum
export const rolesEnum = pgEnum('roles', ['CREATOR', 'FREELANCER', 'ADMIN']);

// Gig status enum
export const gigStatusEnum = pgEnum('gig_status', [
        'DRAFT',
        'ACTIVE',
        'COMPLETED',
        'CANCELLED'
]);

// Application status enum
export const applicationStatusEnum = pgEnum('application_status', [
        'PENDING',
        'ACCEPTED',
        'REJECTED',
        'WITHDRAWN'
]);

// Contract enums
export const contractStatusEnum = pgEnum('contract_status', [
        'ACTIVE',
        'COMPLETED',
        'CANCELLED'
]);
export const contractPaymentStatusEnum = pgEnum('contract_payment_status', [
        'PENDING',
        'PAID',
        'FAILED'
]);

// Wallet enums
export const walletStatusEnum = pgEnum('wallet_status', [
        'ACTIVE',
        'SUSPENDED',
        'CLOSED'
]);

// Payment enums
export const paymentProviderEnum = pgEnum('payment_provider', [
        'PAYSTACK',
        'FLUTTERWAVE',
        'STRIPE'
]);
export const paymentDirectionEnum = pgEnum('payment_direction', [
        'INCOMING',
        'OUTGOING'
]);
export const paymentStatusEnum = pgEnum('payment_status', [
        'INITIATED',
        'PENDING',
        'SUCCESS',
        'FAILED',
        'CANCELLED'
]);
export const paymentChannelEnum = pgEnum('payment_channel', [
        'CARD',
        'TRANSFER',
        'USSD'
]);

// Transaction enums
export const transactionTypeEnum = pgEnum('transaction_type', [
        'CREDIT',
        'DEBIT',
        'RESERVE',
        'RELEASE',
        'REFUND'
]);
export const transactionStatusEnum = pgEnum('transaction_status', [
        'PENDING',
        'SUCCESS',
        'FAILED'
]);
export const transactionSourceEnum = pgEnum('transaction_source', [
        'USER',
        'SYSTEM',
        'ESCROW',
        'EXTERNAL_PAYMENT'
]);

// Escrow enums
export const escrowStatusEnum = pgEnum('escrow_status', [
        'HELD',
        'RELEASED',
        'DISPUTED',
        'CLOSED'
]);
export const escrowTransactionTypeEnum = pgEnum('escrow_transaction_type', [
        'FUND',
        'RELEASE',
        'REFUND',
        'ADJUSTMENT'
]);
export const escrowReleaseTypeEnum = pgEnum('escrow_release_type', [
        'PARTIAL',
        'FULL',
        'MILESTONE'
]);
export const escrowDisputeStatusEnum = pgEnum('escrow_dispute_status', [
        'OPEN',
        'IN_REVIEW',
        'RESOLVED',
        'CLOSED'
]);
