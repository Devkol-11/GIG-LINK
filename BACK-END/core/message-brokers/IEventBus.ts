export interface IEventBus {
  publish(event: string, payload: any): Promise<void> | void;
  consume(
    event: string,
    handler: (payload: any) => Promise<void> | void
  ): Promise<void> | void;
}
