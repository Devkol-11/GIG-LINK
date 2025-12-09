// system-error (For internal use only)
export class SystemError extends Error {
        public readonly name: string;
        public readonly statusCode: number;
        public readonly isSystemError: boolean;
        public readonly isOperational: boolean;

        constructor(
                message = 'An internal system error occurred. Please try again later.'
        ) {
                super(message);
                this.name = 'SystemError';
                this.statusCode = 500;
                this.isSystemError = true;
                this.isOperational = true;
                Object.setPrototypeOf(this, SystemError);
                Error.captureStackTrace(this, this.constructor);
        }
}
