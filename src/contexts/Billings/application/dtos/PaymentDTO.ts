export interface PaymentWebHookEvent {
        event: string;
        data: {
                amount: number;
                reference: string;
                currency: string;
                status: string;
        };
}
