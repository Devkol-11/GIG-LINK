import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class InvalidSignatureError extends BusinessError {
        public readonly statusCode: number = 500;
        constructor(message = 'Invalid signature') {
                super(message);
        }
}

export class PaymentNotFoundError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'Payment not found') {
                super(message);
        }
}

export class WalletNotFoundError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'Wallet not found') {
                super(message);
        }
}

export class InvalidPaymentStateError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'cannot cancel payment') {
                super(message);
        }
}

export class ReferenceNotFoundError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'invalid payment Reference') {
                super(message);
        }
}

export class PayoutAccountError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'payout account not found') {
                super(message);
        }
}

export class InvalidEscrowStateError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'invalid escrow state') {
                super(message);
        }
}

export class EscrowNotFoundError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'escrow Not found') {
                super(message);
        }
}

export class EscrowAccountError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = '') {
                super(message);
        }
}

export class InsufficientWalletBalanceError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'Insufficient balance') {
                super(message);
        }
}

export class UnauthorizedAccessError extends BusinessError {
        public readonly statusCode: number = 401;
        constructor(message = 'Unauthorized') {
                super(message);
        }
}

export class EscrowTransactionNotFoundError extends BusinessError {
        public readonly statusCode: number = 404;
        constructor(message = 'escrow transaction not found') {
                super(message);
        }
}
