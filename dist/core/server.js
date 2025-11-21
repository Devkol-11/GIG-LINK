'use strict';
var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
                return mod && mod.__esModule ? mod : { default: mod };
        };
Object.defineProperty(exports, '__esModule', { value: true });
require('module-alias/register');
const http_1 = __importDefault(require('http'));
const dotenv_1 = __importDefault(require('dotenv'));
const app_1 = require('./app');
const env_1 = require('./config/env');
const prismaClient_1 = require('./database/prismaClient');
const winston_1 = require('./logging/winston');
dotenv_1.default.config();
const PORT = env_1.config.PORT || 3000;
const server = http_1.default.createServer(app_1.ExpressApplication);
const startServer = async (server) => {
        try {
                winston_1.logger.info('connecting to the database...');
                await (0, prismaClient_1.connectDB)();
                winston_1.logger.info('database connected successfully');
                server.listen(PORT, () => {
                        winston_1.logger.info(
                                `server runnning on port ${PORT}`
                        );
                });
        } catch (error) {
                winston_1.logger.warn('error starting the server', error);
        }
};
const shutdown = (server) => {
        server.close(() => {
                winston_1.logger.info('Server closed , Exiting process...');
                process.exit(0);
        });
};
process.on('SIGINT', () => shutdown(server));
process.on('SIGTERM', () => shutdown(server));
startServer(server);
