export class ExternalGatewayError extends Error {
        public readonly name: string = 'ExternalGatewayError';

        public readonly provider: string;

        /**
         * @param provider The name of the payment provider that failed.
         * @param originalMessage The message explaining the nature of the failure (optional).
         */
        constructor(provider: string, originalMessage?: string) {
                // Construct the message that will be logged or displayed.
                const message =
                        `Communication failed with external provider: ${provider}. ${originalMessage || ''}`.trim();

                super(message);

                Object.setPrototypeOf(this, ExternalGatewayError.prototype);

                this.provider = provider;
        }
}
