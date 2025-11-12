export interface IPaymentProcessor {
  // Initialize a payment with the provider
  initializePayment(
    request: PaymentInitializationRequest
  ): Promise<PaymentInitializationResponse>;

  // Verify a payment status with the provider
  verifyPayment(reference: string): Promise<PaymentVerificationResponse>;

  // Create a virtual account for a user (optional)
  createVirtualAccount(userId: string): Promise<VirtualAccountResponse>;

  // Transfer money to a bank account
  transferToBankAccount(request: TransferRequest): Promise<TransferResponse>;
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
  status: "success" | "failed" | "pending";
  amount: number;
  currency: string;
  reference: string;
  gatewayResponse: string;
  paidAt?: Date;
  metadata?: Record<string, any>;
}
