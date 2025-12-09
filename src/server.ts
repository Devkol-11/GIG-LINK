import 'module-alias/register';
import http, { Server } from 'http';
import { ExpressApplication } from './app.js';
import { config } from './infrastructure/env-config/env.js';
import { connectDB_Prisma } from '@core/database/prisma.client.js';
import { pingDb } from '@core/cron/keep.alive.js';
import { logger } from './infrastructure/logging/winston.js';
import { authEventHandlers } from './contexts/Auth/application/eventHandlers/auth.events.handlers.js';

const PORT = config.PORT || 3000;
const server: Server = http.createServer(ExpressApplication);

const startServer = async () => {
        try {
                logger.info('initializing server...');

                await connectDB_Prisma();

                server.listen(PORT, () => {
                        logger.info(`Server running on port ${PORT}`);
                });

                authEventHandlers();
        } catch (error) {
                logger.error('Error starting the server', error);
                process.exit(1);
        }
};

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));

startServer();
pingDb();
