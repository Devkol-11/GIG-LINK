export class Money {
        private readonly amountInKobo: number;

        private constructor(amountKobo: number) {
                this.amountInKobo = amountKobo;
        }

        static create(amountInNaira: number): Money {
                if (amountInNaira < 0) {
                        throw new Error(
                                'Amount must be greater than or equal to zero.'
                        );
                }

                const amountKobo = Math.round(amountInNaira * 100);

                return new Money(amountKobo);
        }

        getAmountInKobo(): number {
                return this.amountInKobo;
        }

        getAmountInNaira(): number {
                return this.amountInKobo / 100;
        }
}
