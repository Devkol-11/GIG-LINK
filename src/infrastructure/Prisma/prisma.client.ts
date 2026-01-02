import { config } from '@src/infrastructure/EnvConfig/env.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../prisma/generated/prisma/client.js';
import { logger } from '@core/Winston/winston.js';

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
                        return (PrismaDbProvider.instance = new PrismaDbProvider());
                }
                return PrismaDbProvider.instance;
        }

        public get dbClient() {
                return this.client;
        }

        public async connectDB() {
                try {
                        await this.client.$connect();
                } catch (error) {
                        logger.info('error connecting to the database');
                        process.exit(1);
                }
        }

        public async disconnectDB() {
                try {
                        await this.client.$disconnect();
                } catch (error) {
                        logger.warn('Failed to close pool', error);
                }
        }
}

export const prismaDbProvider = PrismaDbProvider.getInstance();
export const prismaDbClient = prismaDbProvider.dbClient;
