export class ConcurrencyError extends Error {
        public readonly isConcurrencyError: boolean;
        constructor(
                public readonly message: string,
                public readonly statusCode: number = 409,
                public readonly code: string = 'CONCURRENCY_ERROR'
        ) {
                super(message);
                this.name = 'ConcurrencyError';
                this.isConcurrencyError = true;

                Object.setPrototypeOf(this, ConcurrencyError.prototype);
        }

        static conflict(
                message: string = 'Resource was modified by another process'
        ) {
                return new ConcurrencyError(message, 409, 'CONCURRENCY_ERROR');
        }

        static walletModified(
                message: string = 'Wallet was modified by another process. Please try again.'
        ) {
                return new ConcurrencyError(message, 409, 'WALLET_MODIFIED');
        }

        static resourceStale(
                message: string = "The resource you're trying to modify has been changed by another operation. Please refresh and try again."
        ) {
                return new ConcurrencyError(message, 409, 'RESOURCE_STALE');
        }
}
