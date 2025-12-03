import cron from 'node-cron';
import { dbClient } from '@core/database/drizzle/client/drizzle.client.js';
import { logger } from '@src/infrastructure/logging/winston.js';

export function pingDb() {
        cron.schedule('*/5 * * * *', async () => {
                logger.info('pinging db....');

                const count = await dbClient.user.count();

                logger.info(`users in db : ${count}`);
        });
}
