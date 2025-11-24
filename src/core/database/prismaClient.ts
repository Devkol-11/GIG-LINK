import { Prisma, PrismaClient } from '@prisma/client';
import { logger } from '../logging/winston.js';

export class PrismaService {
        private static instance: PrismaService;

        private static client: PrismaClient = new PrismaClient();

        private constructor() {}

        public static getInstance(): PrismaService {
                if (PrismaService.instance === null) {
                        PrismaService.instance = new PrismaService();
                }
                return PrismaService.instance;
        }

        public getClient(): PrismaClient {
                if (!PrismaService.client) {
                        PrismaService.client = new PrismaClient();
                        return PrismaService.client;
                }
                return PrismaService.client;
        }

        public static async connectDB() {
                try {
                        logger.info('connecting to the database');

                        await this.client.$connect();

                        logger.info('database connection successful');
                } catch (error) {
                        logger.warn('error connecting to the database', error);

                        process.exit(0);
                }
        }

        public static async disconnectDB() {
                try {
                        logger.info('disconnecting the database');

                        await this.client.$disconnect();

                        logger.info('database disconnectd successfully');
                } catch (error) {
                        logger.warn('error disconnecting the database');
                }
        }
}

export const prisma = PrismaService.getInstance();
export const dbClient = PrismaService.getInstance().getClient();
export const connectDB = () => PrismaService.connectDB();
export const disconnectDB = () => PrismaService.disconnectDB();
