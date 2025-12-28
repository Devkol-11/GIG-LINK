export interface IEventBus {
        publish(event: string, payload: any): Promise<void>;

        subscribe(event: string, callback: (payload: any) => Promise<void>): void
}
