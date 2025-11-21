import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class InvalidSignatureError extends BusinessError {
        constructor(message = 'Invalid signature') {
                super(message);
        }
}

export class PaymentNotFoundError extends BusinessError {
        constructor(message = 'Payment not found') {
                super(message);
        }
}

export class InvalidPaymentStateError extends BusinessError {
        constructor(message = 'cannot cancel payment') {
                super(message);
        }
}
