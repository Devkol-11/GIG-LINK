export class TransactionId {
        private constructor(private readonly value: string) {}

        static create(id: string) {
                if (!id) throw new Error('TransactionId cannot be empty');

                return new TransactionId(id);
        }

        get raw() {
                return this.value;
        }
}
