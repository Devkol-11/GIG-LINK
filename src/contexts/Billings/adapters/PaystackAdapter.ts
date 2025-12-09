import { Paystack } from 'paystack-sdk';
import crypto from 'crypto';

import {
        IPaymentProvider,
        PaymentInitializationRequest,
        PaymentInitializationResponse,
        PaymentVerificationResponse
} from '../ports/IPaymentProvider.js';
import { SystemError } from '@src/shared/errors/SystemError.js';
import { logger } from '@core/logging/winston.js';

export class PaystackAdapter implements IPaymentProvider {
        private client;

        constructor(private readonly secretKey: string) {
                if (!secretKey || secretKey === '') {
                        logger.warn('Paystack api key not provided');
                        throw new SystemError();
                }
                this.client = new Paystack(secretKey);
        }

        async initializePayment(
                request: PaymentInitializationRequest
        ): Promise<PaymentInitializationResponse> {
                const { amount, email, reference, callbackUrl, metadata } = request;

                const response = await this.client.transaction.initialize({
                        amount: amount.toString(),
                        email,
                        reference,
                        callback_url: callbackUrl,
                        metadata
                });

                if (!response.status || !response.data) {
                        throw new Error(response.message || 'Failed to initialize payment');
                }

                return {
                        authorizationUrl: response.data.authorization_url,
                        reference: response.data.reference,
                        accessCode: response.data.access_code
                };
        }

        async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
                const response = await this.client.transaction.verify(reference);

                if (response.status || !response.data) {
                        throw new Error('failed to verify payment');
                }

                return {
                        amount: response.data.amount,
                        status: response.data.status,
                        currency: response.data.currency,
                        reference: response.data.reference,
                        gatewayResponse: response.data.gateway_response
                };
        }

        async verifySignature(rawBody: string, signature: string): Promise<boolean> {
                const computedHash = crypto
                        .createHmac('sha512', this.secretKey)
                        .update(rawBody)
                        .digest('hex');

                return computedHash === signature;
        }
}

export const paystackAdapter = new PaystackAdapter('');
