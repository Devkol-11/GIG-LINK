import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { logger } from '../../../logging/winston.js';
import { config } from '../../../env-config/env.js';

export class DrizzleService {
        private static instance: DrizzleService | null = null;
        private pool: Pool;
        private db;

        private constructor() {
                this.pool = new Pool({
                        connectionString: config.DATABASE_URL,
                        ssl: true
                });

                this.db = drizzle(this.pool);
        }

        public static getInstance(): DrizzleService {
                if (!this.instance) {
                        this.instance = new DrizzleService();
                }
                return this.instance;
        }

        public getDB() {
                return this.db;
        }

        public async connectDB() {
                try {
                        logger.info('Testing DB pool connection...');
                        const result = await this.pool.query(
                                'SELECT COUNT(*) FROM users;'
                        );
                        logger.info(`User count: ${result.rows[0].count}`);

                        logger.info('Connected to PostgreSQL via Pool');
                } catch (error) {
                        logger.error('Database connection failed', error);
                        process.exit(1);
                }
        }

        public async disconnectDB() {
                try {
                        logger.info('Shutting down PostgreSQL pool...');

                        await this.pool.end();

                        logger.info('PostgreSQL pool closed');
                } catch (error) {
                        logger.warn('Failed to close pool', error);
                }
        }
}

export const drizzleService = DrizzleService.getInstance();
export const dbClient = drizzleService.getDB();
export const connectDB = () => drizzleService.connectDB();
export const disconnectDB = () => drizzleService.disconnectDB();
