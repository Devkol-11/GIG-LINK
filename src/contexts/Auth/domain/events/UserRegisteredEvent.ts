export class UserRegisteredEvent {
        public eventName = 'user:registered';
        public routingKey = 'auth.registered';
        constructor(
                public readonly userId: string,
                public readonly email: string,
                public readonly firstName: string,
                public readonly role: string
        ) {}

        public getEventPayload() {
                return {
                        userId: this.userId,
                        email: this.email,
                        firstName: this.firstName,
                        role: this.role
                };
        }
}
