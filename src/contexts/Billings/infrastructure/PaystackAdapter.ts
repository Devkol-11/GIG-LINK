import { BusinessError } from "@src/shared/errors/BusinessError.js";

import {
  IPaymentProcessor,
  PaymentInitializationRequest,
  PaymentInitializationResponse,
  PaymentVerificationResponse,
} from "../ports/IPaymentProcessor.js";

export class PayStackAdapter implements IPaymentProcessor {
  private readonly payStackApiKey: string;
  private readonly baseUrl: string;
  constructor(readonly apiKey: string) {
    this.payStackApiKey = apiKey;
    this.baseUrl = "hhtps://api/paystack.co";
  }

  async initializePayment(
    request: PaymentInitializationRequest
  ): Promise<PaymentInitializationResponse> {
    const { amount, email, reference, callbackUrl, metadata } = request;
    // send a request to paystack to intialize the payment

    const response = await fetch(`${this.baseUrl}/payment/initalize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.payStackApiKey}`,
        "Content-type": "application/json",
        body: JSON.stringify({
          amount,
          email,
          reference,
          callbackUrl,
          metadata,
        }),
      },
    });

    // get a intialization response
    const data = await response.json();
    if (!data.status) {
      throw new BusinessError("failed to intialize payment");
    }
    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    // send a request to Paystacks verify transaction endpoint

    const response = await fetch(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.payStackApiKey}`,
        },
      }
    );

    //get a verification response
    const data = await response.json();
    if (!data.status) {
      throw new BusinessError(`Paystack verification failed: ${data.message}`);
    }

    // return response to Domain
    return {
      status: data.data.status,
      amount: data.data.amount,
      currency: data.data.currency,
      reference: data.data.reference,
      gatewayResponse: data.data.gateway_response,
      paidAt: data.data.paid_at ? new Date(data.data.paid_at) : undefined,
      metadata: data.data.metadata,
    };
  }
}
