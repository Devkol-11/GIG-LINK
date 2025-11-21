export interface IPaymentProvider {
        // Initialize a payment with the provider
        initializePayment(
                request: PaymentInitializationRequest
        ): Promise<PaymentInitializationResponse>;

        verifyPayment(reference: string): Promise<PaymentVerificationResponse>;
        verifySignature(
                rawBody: string,
                signature: string,
                secretKey: string
        ): Promise<boolean>;
}

// DTOs for the payment processor
export interface PaymentInitializationRequest {
        amount: number; // in cents
        email: string;
        reference: string;
        callbackUrl?: string;
        metadata?: Record<string, any>;
}

export interface PaymentInitializationResponse {
        authorizationUrl: string;
        reference: string;
        accessCode?: string;
}

export interface PaymentVerificationResponse {
        status: 'success' | 'failed' | 'pending';
        amount: number;
        currency: string;
        reference: string;
        gatewayResponse: string;
        paidAt?: Date;
        metadata?: Record<string, any>;
}
