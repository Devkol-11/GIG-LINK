import "module-alias/register";
import http, { Server } from "http";
import dotenv from "dotenv";
import { ExpressApplication } from "./app";
import { config } from "./config/env";
import { connectDB } from "./database/prismaClient";
import { logger } from "./logging/winston";

dotenv.config();

const PORT = config.PORT || 3000;

const server: Server = http.createServer(ExpressApplication);

const startServer = async (server: Server) => {
  try {
    logger.info("connecting to the database...");

    await connectDB();

    logger.info("database connected successfully");

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
