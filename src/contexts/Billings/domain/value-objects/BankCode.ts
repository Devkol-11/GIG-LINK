export class BankCode {
        private readonly value: string;

        private constructor(value: string) {
                this.value = value;
        }

        public static create(input: string | number): BankCode {
                let v: string;

                if (typeof input === 'number') {
                        v = String(input);
                } else {
                        v = input.trim();
                }

                if (!v) {
                        throw new Error('Bank Code cannot be empty.');
                }

                if (v.length !== 3) {
                        throw new Error(`Bank Code must be exactly 3 digits, but received ${v.length}.`);
                }

                if (!/^\d{3}$/.test(v)) {
                        throw new Error('Bank Code must contain only digits.');
                }

                return new BankCode(v);
        }

        // --- Accessor Methods ---

        public getValue(): string {
                return this.value;
        }

        public equals(other: BankCode): boolean {
                return this.value === other.value;
        }
}
