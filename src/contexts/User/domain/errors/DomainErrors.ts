import { BusinessError } from '@src/shared/errors/BusinessError.js';

export class InternalServerError extends BusinessError {
        public readonly statusCode: number = 500;

        constructor(message = 'something went wrong') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class UserNotFoundError extends BusinessError {
        public readonly statusCode: number = 404;

        constructor(message = 'User not found') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class UserProfileNotFoundError extends BusinessError {
        public readonly statusCode: number = 404;

        constructor(message = 'User profile not found') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class InvalidCredentialsError extends BusinessError {
        public readonly statusCode: number = 401;

        constructor(message = 'Invalid credentials') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class UnAuthorizedAccessError extends BusinessError {
        public readonly statusCode: number = 401;

        constructor(message = 'Not allowed') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class UserConflictError extends BusinessError {
        public readonly statusCode: number = 409;

        constructor(message = ' User already exists') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class TokenNotFoundError extends BusinessError {
        public readonly statusCode: number = 404;

        constructor(message = 'OTP not found , generate a new one') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}

export class InvalidTokenError extends BusinessError {
        public readonly statusCode: number = 404;

        constructor(message = 'Invalid OTP') {
                super(message);
                Object.setPrototypeOf(this, BusinessError);
        }
}
