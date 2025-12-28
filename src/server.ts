import 'module-alias/register';
import http, { Server } from 'http';
import { ExpressApplication } from './app.js';
import { config } from '@src/infrastructure/EnvConfig/env.js';
import { prismaDbProvider } from '@core/Prisma/prisma.client.js';
import { infrastructureManager } from '@core/infraInit.js';
import { pingDb } from '@core/NodeCron/keep.alive.js';
import { logger } from './infrastructure/Winston/winston.js';

const PORT = config.PORT || 3000;
const server: Server = http.createServer(ExpressApplication);

const startServer = async () => {
        try {
                logger.info('initializing server...');

                await prismaDbProvider.connectDB();

                await infrastructureManager.initialize();

                server.listen(PORT, () => {
                        logger.info(`Server running on port ${PORT}`);
                });
        } catch (error) {
                logger.error('Error starting the server', error);
                await prismaDbProvider.disconnectDB();

                await infrastructureManager.close();

                process.exit(1);
        }
};

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));

startServer();
pingDb();
