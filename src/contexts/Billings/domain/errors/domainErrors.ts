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
