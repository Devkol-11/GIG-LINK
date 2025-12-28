export class EscrowAccountCreated {
        public readonly eventName: string = 'escrowAccount:Created';

        constructor(
                readonly escrowAccountId: string,
                readonly creatorId: string,
                readonly amount: number
        ) {}

        getEventPayload() {
                return {
                        escrowAccountId: this.escrowAccountId,
                        creatorId: this.creatorId,
                        amount: this.amount
                };
        }
}
