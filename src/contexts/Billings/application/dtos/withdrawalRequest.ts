export interface clientWithdrawalRequestCommand {
        userId: string;
        name: string;
        clientName: string;
        description: string;
        accountNumber: string;
        amount: number;
        bankCode: string;
}

export interface PaystackWithdrawalRequestCommand {}
