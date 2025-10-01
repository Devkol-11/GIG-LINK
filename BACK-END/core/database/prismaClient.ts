import { PrismaClient } from "@prisma/client";
import { logger } from "../logging/winston";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    logger.warn("error connecting with the database");
  }
};

export default prisma;
