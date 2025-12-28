export interface IUnitOfWork {
        /**
         * Executes a callback inside a transaction.
         * The callback receives a transaction context.
         */
        transaction<T>(callback: (trx: any) => Promise<T>): Promise<T>;
}
