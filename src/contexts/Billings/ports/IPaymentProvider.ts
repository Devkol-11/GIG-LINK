export interface IPaymentProvider {
        initializePayment(request: PaymentInitializationRequest): Promise<PaymentInitializationResponse>;

        verifyPayment(reference: string): Promise<PaymentVerificationResponse>;
        verifySignature(rawBody: string, signature: string): Promise<boolean>;
        getTransferRecepient(request: TransferRecepientRequest): Promise<VerifiedRecipientData>;
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
        status: string;
        amount: number;
        currency: string;
        reference: string;
        gatewayResponse: string;
        paidAt?: Date;
        metadata?: Record<string, any>;
}

export interface TransferRecepientRequest {
        type: 'nuban';
        name: string;
        accountNumber: string;
        bankCode: string;
        description?: string;
        currency: string;
}

export interface VerifiedRecipientData {
        recipientCode: string;
        verifiedAccountName: string; // The crucial verified name
        accountNumber: string; // The original number (for your records)
}
