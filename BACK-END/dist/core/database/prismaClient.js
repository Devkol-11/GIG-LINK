"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = exports.PrismaService = void 0;
const client_1 = require("@prisma/client");
const winston_1 = require("../logging/winston");
class PrismaService {
    constructor() { }
    static getInstance() {
        if (!PrismaService.instance) {
            PrismaService.instance = new client_1.PrismaClient({
                log: ["query", "info", "warn", "error"],
            });
        }
        return PrismaService.instance;
    }
    static async connectDB() {
        const client = this.getInstance();
        try {
            winston_1.logger.info("connecting to the database");
            await client.$connect();
            winston_1.logger.info("database connection successful");
        }
        catch (error) {
            winston_1.logger.warn("error connecting to the database", error);
            process.exit(0);
        }
    }
    static async disconnectDB() {
        const client = this.getInstance();
        try {
            winston_1.logger.info("disconnecting the database");
            await client.$disconnect();
            winston_1.logger.info("database disconnectd successfully");
        }
        catch (error) {
            winston_1.logger.warn("error disconnecting the database");
        }
    }
}
exports.PrismaService = PrismaService;
exports.prisma = PrismaService.getInstance();
const connectDB = () => PrismaService.connectDB();
exports.connectDB = connectDB;
const disconnectDB = () => PrismaService.disconnectDB();
exports.disconnectDB = disconnectDB;
