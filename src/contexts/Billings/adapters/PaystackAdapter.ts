import { Paystack } from 'paystack-sdk';
import crypto from 'crypto';
import {
        IPaymentProvider,
        PaymentInitializationRequest,
        PaymentInitializationResponse,
        PaymentVerificationResponse,
        TransferInitializationRequest,
        TransferInitializationResponse,
        TransferInitiatedGatewayResponse,
        TransferRecepientRequest,
        VerifiedRecipientData
} from '../ports/IPaymentProvider.js';
import { SystemError } from '@src/shared/errors/SystemError.js';
import { ExternalGatewayError } from '@src/shared/errors/ExternalGatewayError.js';
import { config } from '@src/infrastructure/EnvConfig/env.js';
import { logger } from '@core/Winston/winston.js';

export class PaystackAdapter implements IPaymentProvider {
        private client;

        constructor(private readonly secretKey: string) {
                if (!secretKey || secretKey === '') {
                        const err = new SystemError('Paystack api key not provided');
                        logger.warn(err);
                        throw err;
                }
                this.client = new Paystack(secretKey);
        }

        async initializePayment(
                request: PaymentInitializationRequest
        ): Promise<PaymentInitializationResponse> {
                try {
                        const { amount, email, reference, callbackUrl, metadata } = request;

                        const response = await this.client.transaction.initialize({
                                amount: amount.toString(),
                                email,
                                reference,
                                callback_url: callbackUrl,
                                metadata
                        });

                        if (!response.status || !response.data) {
                                const err = new ExternalGatewayError(
                                        'Paystack',
                                        response.message || 'failed to intialize payment'
                                );
                                logger.warn(err);
                                throw err;
                        }

                        return {
                                authorizationUrl: response.data.authorization_url,
                                reference: response.data.reference,
                                accessCode: response.data.access_code
                        };
                } catch (err: any) {
                        if (!err.response || err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED')
                                throw new ExternalGatewayError('paystack', err.message);
                        logger.warn(err);
                        throw err;
                }
        }

        async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
                try {
                        const response = await this.client.transaction.verify(reference);

                        if (response.status || !response.data) {
                                const err = new ExternalGatewayError(
                                        'paystack',
                                        response.message || 'failed to verify payment'
                                );
                                logger.warn(err);
                                throw err;
                        }

                        return {
                                amount: response.data.amount,
                                status: response.data.status,
                                currency: response.data.currency,
                                reference: response.data.reference,
                                gatewayResponse: response.data.gateway_response
                        };
                } catch (err: any) {
                        if (!err.response || err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED')
                                throw new ExternalGatewayError('paystack', err.message);
                        logger.warn(err);
                        throw err;
                }
        }

        async getTransferRecepient(request: TransferRecepientRequest): Promise<VerifiedRecipientData> {
                try {
                        const { type, name, accountNumber, bankCode, description, currency } = request;

                        const response = await this.client.recipient.create({
                                type,
                                name,
                                description,
                                currency,
                                account_number: accountNumber,
                                bank_code: bankCode
                        });

                        if (!response || !response.message || !response.data)
                                throw new ExternalGatewayError(
                                        'paystack',
                                        response.message || 'failed to get transfer recipient'
                                );

                        return {
                                recipientCode: response.data.recipient_code,
                                verifiedAccountName: response.data.details.account_name,
                                accountNumber: response.data.details.account_number
                        };
                } catch (err: any) {
                        if (!err.response || err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED')
                                throw new ExternalGatewayError('paystack', err.message);
                        logger.warn(err);
                        throw err;
                }
        }

        async initiateTransfer(
                request: TransferInitializationRequest
        ): Promise<TransferInitializationResponse> {
                try {
                        const { source, amount, recipient, reason, reference } = request;

                        const response = await this.client.transfer.initiate({
                                source,
                                amount,
                                recipient,
                                reason,
                                reference
                        });

                        if (!response.message || !response.status)
                                throw new ExternalGatewayError(
                                        'paystack',
                                        `failed to initiate transfer : ${response.message}`
                                );

                        const initiatedResponse = response as TransferInitiatedGatewayResponse;

                        return {
                                providerReference: initiatedResponse.data.providerReference,
                                status: initiatedResponse.status,
                                message: initiatedResponse.message
                        };
                } catch (err: any) {
                        if (!err.response || err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
                                throw new ExternalGatewayError('paystack', err.message);
                        }
                        logger.warn(err);
                        throw err;
                }
        }

        async verifySignature(rawBody: string, signature: string): Promise<boolean> {
                const computedHash = crypto
                        .createHmac('sha512', this.secretKey)
                        .update(rawBody)
                        .digest('hex');

                return computedHash === signature;
        }
}

export const paystackAdapter = new PaystackAdapter(config.PAYSTACK_TEST_SECRET_KEY);
