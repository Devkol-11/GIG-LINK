export class PasswordResetEvent {
        public readonly event_type = 'password:reset';
        public readonly routing_key = 'auth.passwordReset';
        public readonly timeStamp = new Date();

        constructor(
                public readonly userId: string,
                public readonly email: string,
                public readonly token: string
        ) {}
}
