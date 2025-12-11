export class AccountNumber {
        private readonly value: string;

        private constructor(value: string) {
                this.value = value;
        }

        public static create(input: number | string): AccountNumber {
                let value: number;
                let v: string;

                if (typeof input === 'string') {
                        v = input.trim();
                        value = Number(v);
                } else {
                        v = String(input);
                        value = input;
                }

                if (Number.isNaN(value)) {
                        throw new Error('Account number must be a valid number.');
                }

                if (value <= 0) {
                        throw new Error('Account number cannot be zero or negative.');
                }

                if (!Number.isInteger(value)) {
                        throw new Error('Account number must be an integer (no decimals).');
                }

                const accString = String(Math.floor(value));

                if (!/^\d+$/.test(accString)) {
                        throw new Error('Account number can only contain digits.');
                }

                if (accString.length !== 10) {
                        throw new Error(
                                `Account number must be 10 digits long, but received ${accString.length}.`
                        );
                }

                return new AccountNumber(accString);
        }

        // --- Accessor Methods ---
        public getValue(): string {
                return this.value;
        }

        public equals(other: AccountNumber): boolean {
                return this.value === other.value;
        }
}
