export interface IEventPublisher {
  publish(event: string, payload: any): Promise<void>;
}
