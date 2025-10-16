export interface IEventConsumer {
  consume(): Promise<void>;
}

export interface IRabbitMQService {
  consume(
    exchange: string,
    routingKey: string,
    queueName: string
  ): Promise<void>;
}
