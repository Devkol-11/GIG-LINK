export interface IEventBus {
        publish(event: string, payload: any): Promise<void>;

        consume(
                event: string,
                callback: (payload: any) => Promise<void>
        ): Promise<void>;
}
