import { PrismaClient } from "@prisma/client";
import { logger } from "../logging/winston";

export class PrismaService {
  private static instance: PrismaClient;
  constructor() {}

  public static getInstance() {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: ["query", "info", "warn", "error"],
      });
    }
    return PrismaService.instance;
  }

  public static async connectDB() {
    const client = this.getInstance();
    try {
      logger.info("connecting to the database");
      await client.$connect();
      logger.info("database connection successful");
    } catch (error) {
      logger.warn("error connecting to the database", error);
      process.exit(0);
    }
  }

  public static async disconnectDB() {
    const client = this.getInstance();
    try {
      logger.info("disconnecting the database");
      await client.$disconnect();
      logger.info("database disconnectd successfully");
    } catch (error) {
      logger.warn("error disconnecting the database");
    }
  }
}

export const prisma = PrismaService.getInstance();
export const connectDB = () => PrismaService.connectDB();
export const disconnectDB = () => PrismaService.disconnectDB();
