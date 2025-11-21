'use strict';
var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
                return mod && mod.__esModule ? mod : { default: mod };
        };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ExpressApplication = void 0;
const express_1 = __importDefault(require('express'));
const helmet_1 = __importDefault(require('helmet'));
const morgan_1 = __importDefault(require('morgan'));
const AuthRoutes_1 = require('@src/contexts/Auth/http/routes/AuthRoutes');
const winston_1 = require('./logging/winston');
const globalErrorHandler_1 = require('@src/shared/middlewares/globalErrorHandler');
winston_1.logger.info('request entered Express');
const createExpressApplication = (authRoutes) => {
        const ExpressApplication = (0, express_1.default)();
        ExpressApplication.use(express_1.default.json());
        ExpressApplication.use((0, morgan_1.default)('dev'));
        ExpressApplication.use((0, helmet_1.default)());
        ExpressApplication.use('/api/auth', authRoutes);
        ExpressApplication.use(globalErrorHandler_1.globalErrorHandler);
        return ExpressApplication;
};
exports.ExpressApplication = createExpressApplication(AuthRoutes_1.authRoutes);
