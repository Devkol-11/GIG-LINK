import cron from 'node-cron';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { logger } from '@core/Winston/winston.js';

export function pingDb() {
        cron.schedule('*/3 * * * *', async () => {
                logger.info('pinging db....');

                const count = await prismaDbClient.user.count();

                logger.info(`users in db : ${count}`);
        });
}
