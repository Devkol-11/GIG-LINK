export class BusinessError extends Error {
        public readonly isBusinessError: boolean;

        constructor(
                public readonly message: string,
                public readonly statusCode: number = 400,
                public readonly code?: string
        ) {
                super(message);
                this.name = 'BusinessError';
                this.isBusinessError = true;
                Error.captureStackTrace(this, this.constructor);
                Object.setPrototypeOf(this, BusinessError.prototype);
        }

        static badRequest(message: string, code?: string) {
                return new BusinessError(message, 400, code);
        }

        static unauthorized(message: string, code?: string) {
                return new BusinessError(message, 401, code);
        }

        static forbidden(message: string, code?: string) {
                return new BusinessError(message, 403, code);
        }

        static notFound(message: string, code?: string) {
                return new BusinessError(message, 404, code);
        }

        static conflict(message: string, code?: string) {
                return new BusinessError(message, 409, code);
        }
}
