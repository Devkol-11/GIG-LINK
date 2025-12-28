export interface PayoutAccountProps {
        id: string;
        userId: string;
        code: string;
        accountName: string;
        accountNumber: string;
        createdAt: Date;
}

export class PayoutAccount {
        private constructor(private props: PayoutAccountProps) {}

        public static Create(props: Omit<PayoutAccountProps, 'id' | 'createdAt'>): PayoutAccount {
                return new PayoutAccount({
                        id: crypto.randomUUID(),
                        createdAt: new Date(),
                        ...props
                });
        }

        public static toEntity(props: PayoutAccountProps): PayoutAccount {
                return new PayoutAccount({ ...props });
        }

        public getState() {
                return { ...this.props };
        }

        get id() {
                return this.props.id;
        }

        get userId() {
                return this.props.userId;
        }

        get code() {
                return this.props.code;
        }

        get accountName() {
                return this.props.accountName;
        }

        get accountNumber() {
                return this.props.accountNumber;
        }
}
