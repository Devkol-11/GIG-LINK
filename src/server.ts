import 'module-alias/register';
import http, { Server } from 'http';
import { ExpressApplication } from './app.js';
import { config } from '@src/infrastructure/EnvConfig/env.js';
import { infrastructureManager } from '@src/infrastructure/infraInit.js';
import { logger } from './infrastructure/Winston/winston.js';
import { user_registered_handler } from './contexts/User/application/subscribers/userRegistered.js';

const PORT = config.PORT || 3000;
const server: Server = http.createServer(ExpressApplication);

const startServer = async () => {
        try {
                logger.info('initializing server...');

                await infrastructureManager.initialize();

                user_registered_handler();

                logger.info('starting server...');

                server.listen(PORT, () => {
                        logger.info(`Server running on port ${PORT}`);
                });
        } catch (error) {
                logger.error('Error starting the server', error);

                await infrastructureManager.close();

                process.exit(1);
        }
};

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));

startServer();
