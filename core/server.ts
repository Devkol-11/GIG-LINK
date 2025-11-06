import "module-alias/register";
import http, { Server } from "http";
import dotenv from "dotenv";
import { ExpressApplication } from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./database/prismaClient.js";
import { rabbitMQService } from "./message-brokers/RabbitMQ.js";
import { logger } from "./logging/winston.js";

dotenv.config();

const PORT = config.PORT || 3000;

const server: Server = http.createServer(ExpressApplication);

const startServer = async (server: Server) => {
  try {
    await connectDB();

    // await rabbitMQService.connect();

    logger.info("RabbitMQ connected Successfully");

    server.listen(PORT, () => {
      logger.info(`server runnning on port ${PORT}`);
    });
  } catch (error) {
    logger.warn("error starting the server", error);
  }
};

const shutdown = (server: Server) => {
  server.close(() => {
    logger.info("Server closed , Exiting process...");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown(server));
process.on("SIGTERM", () => shutdown(server));

startServer(server);
