import { BusinessError } from "@src/shared/errors/BusinessError.js";
import crypto from "crypto";

import {
  IPaymentProvider,
  PaymentInitializationRequest,
  PaymentInitializationResponse,
  PaymentVerificationResponse,
} from "../ports/IPaymentProvider.js";

// infrastructure/adapters/PayStackAdapter.ts
export class PayStackAdapter implements IPaymentProvider {
  private readonly payStackApiKey: string;
  private readonly baseUrl = "https://api.paystack.co";

  constructor(readonly apiKey: string) {
    this.payStackApiKey = apiKey;
  }

  //------1
  async initializePayment(
    request: PaymentInitializationRequest
  ): Promise<PaymentInitializationResponse> {
    const { amount, email, reference, callbackUrl, metadata } = request;

    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.payStackApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        email,
        reference,
        callback_url: callbackUrl,
        metadata,
      }),
    });

    const data = await response.json();
    if (!data.status) {
      throw new BusinessError(`Failed to initialize payment: ${data.message}`);
    }

    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
    };
  }

  ///-----2
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    const response = await fetch(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.payStackApiKey}`,
        },
      }
    );

    const data = await response.json();
    if (!data.status) {
      throw new BusinessError(`Paystack verification failed: ${data.message}`);
    }

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

  async verifySignature(rawBody: string, signature: string, secretKey: string) {
    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    return hash === signature;
  }
}

export const paystackApapter = new PayStackAdapter()