export class UserRegisteredEvent {
        static eventName = 'user.registered';
        constructor(
                public readonly userId: string,
                public readonly email: string,
                public readonly firstName: string,
                public readonly role: string
        ) {}
}
