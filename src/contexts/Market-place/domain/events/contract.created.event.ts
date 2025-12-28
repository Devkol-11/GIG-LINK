export class ContractCreatedEvent {
        public readonly eventName: string = 'contract:created';
        public readonly createdAt: number = Date.now();

        constructor(
                readonly applicationId: string,
                readonly creatorId: string,
                readonly freeLancerId: string,
                readonly amount: number
        ) {}

        getPayload() {
                return {
                        eventName: this.eventName,
                        applicationId: this.applicationId,
                        freelancerId: this.freeLancerId,
                        amount: this.amount,
                        createdAt: this.createdAt
                };
        }
}
