export class PasswordResetEvent {
        public readonly eventName = 'password:reset';
        public readonly routing_key = 'auth.passwordReset';
        public readonly timeStamp = new Date();

        constructor(
                public readonly userId: string,
                public readonly email: string,
                public readonly otp: string
        ) {}

        public getEventPayload() {
                return {
                        email: this.email,
                        otp: this.otp
                };
        }
}
