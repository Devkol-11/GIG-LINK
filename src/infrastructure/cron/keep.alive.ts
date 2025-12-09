import cron from 'node-cron';
import { prismaDbClient } from '@core/database/prisma.client.js';
import { logger } from '@src/infrastructure/logging/winston.js';

export function pingDb() {
        cron.schedule('*/3 * * * *', async () => {
                logger.info('pinging db....');

                const count = await prismaDbClient.user.count();

                logger.info(`users in db : ${count}`);
        });
}
