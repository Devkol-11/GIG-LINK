export class ApplicationAcceptedEvent {
        public eventName: string = 'application.Accepted';
        constructor(
                public applicationId: string,
                public freeLancerId: string
        ) {}
}
