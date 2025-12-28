export interface WithdrawalRequestCommand {
        userId: string;
        amount: number;
        name: string;
        accountNumber: string;
        bankCode: string;
        accountName?: string;
}

export interface WithdrawalWebhookCommand {
        event: string;
        data: {
                reference: string;
                amount: number;
                currency: string;
                status: string;
        };
}
