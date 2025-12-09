import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class ContractNotFound extends BusinessError {
        public readonly statusCode: number = 404;
        public readonly isBusinessError: boolean = true;

        constructor(message = 'Contract not found') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class ContractConflict extends BusinessError {
        public readonly statusCode: number = 409;
        public readonly isBusinessError: boolean = true;

        constructor(message = 'Unable to process this request') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class NotAllowed extends BusinessError {
        public readonly statusCode: number = 401;
        public readonly isBusinessError: boolean = true;

        constructor(message = 'Not allowed') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class NotFound extends BusinessError {
        public readonly statusCode: number = 404;
        public readonly isBusinessError: boolean = true;

        constructor(message = ' Not found') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class GigNotFound extends BusinessError {
        public readonly statusCode: number = 404;
        public readonly isBusinessError: boolean = true;

        constructor(message = 'Gig not found') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class GigConflict extends BusinessError {
        public readonly statusCode: number = 409;
        public readonly isBusinessError: boolean = true;

        constructor(message = 'You have already applied for this gig') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class GigNotActive extends BusinessError {
        public readonly statusCode: number = 422;
        public readonly isBusinessError: boolean = true;

        constructor(message = 'Unable to apply to this gig') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class ApplicationNotFound extends BusinessError {
        public readonly statusCode: number = 404;
        public readonly isBusinessError: boolean = true;

        constructor(message = 'Application not found') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class ApplicationConflict extends BusinessError {
        public readonly statusCode: number = 409;
        public readonly isBusinessError: boolean = true;

        constructor(message = 'Unable to process this request') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}
