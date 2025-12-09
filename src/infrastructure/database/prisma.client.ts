import { config } from '@core/env-config/env.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../prisma/generated/prisma/client.js';
import { logger } from '@core/logging/winston.js';

export class PrismaDbProvider {
        public static instance: PrismaDbProvider;
        private client: PrismaClient;
        private adapter: PrismaPg;
        private connectionString;

        private constructor() {
                this.connectionString = config.DATABASE_URL;

                this.adapter = new PrismaPg({
                        connectionString: this.connectionString
                });

                this.client = new PrismaClient({ adapter: this.adapter });
        }

        public static getInstance() {
                if (!PrismaDbProvider.instance) {
                        return (PrismaDbProvider.instance =
                                new PrismaDbProvider());
                }
                return PrismaDbProvider.instance;
        }

        public get dbClient() {
                return this.client;
        }

        public async connectDB() {
                try {
                        logger.info('connecting to the database..');

                        await this.client.$connect();

                        logger.info('connected to database..');
                } catch (error) {
                        logger.info('error connecting to the database');
                        process.exit(1);
                }
        }

        public async disconnectDB() {
                try {
                        logger.info('disconnecting database..');

                        await this.client.$disconnect();

                        logger.info('database disconnected successfully');
                } catch (error) {
                        logger.warn('Failed to close pool', error);
                }
        }
}

export const prismaDbProvider = PrismaDbProvider.getInstance();
export const prismaDbClient = prismaDbProvider.dbClient;
export const connectDB_Prisma = () => prismaDbProvider.connectDB();
export const disconnectDB_Prisma = () => prismaDbProvider.disconnectDB();
