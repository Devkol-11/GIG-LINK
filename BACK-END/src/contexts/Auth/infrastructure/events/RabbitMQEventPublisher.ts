// import { logger } from "@core/logging/winston";
// import { EventPublisher } from "./EventPublisher";
// import rabbitMQConnection from "../messaging/rabbitMQConnection";

// export class RabbitMQEventPublisher implements EventPublisher {

//   async publish(eventType: string, payload: any): Promise<void> {
//     try {

//       const channel = await rabbitMQConnection.createChannel();
//       await channel.assertExchange("user_events", "topic", { durable: true });

//       channel.publish(
//         "user_events",
//         eventType,
//         Buffer.from(
//           JSON.stringify({
//             ...payload,
//             eventId: crypto.randomUUID(),
//             timestamp: new Date().toISOString(),
//           })
//         )
//       );

//       await channel.close();
//     } catch (error) {
//       console.error("Failed to publish event:", error);
//       throw new Error(`Event publishing failed: ${error.message}`);
//     }
//   }
// }
