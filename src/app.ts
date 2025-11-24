import Express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRoutes } from '@src/contexts/Auth/http/routes/AuthRoutes.js';
import { userRoutes } from '@src/contexts/User/http/routes/UserRoutes.js';
import { marketPlaceRoutes } from '@src/contexts/Market-place/http/routes/marketPlaceRoutes.js';
import { billingRoutes } from '@src/contexts/Billings/http/routes/billingRoutes.js';
import { logger } from './core/logging/winston.js';
import { globalErrorHandler } from '@src/shared/middlewares/globalErrorHandler.js';

const createExpressApplication = (
        authRoutes: Express.Router,
        userRoutes: Express.Router,
        marketPlaceRoutes: Express.Router
        // billingRoutes: Express.Router
): Express.Application => {
        const ExpressApplication = Express();

        ExpressApplication.use(Express.json());
        ExpressApplication.use(morgan('dev'));
        ExpressApplication.use(helmet());

        ExpressApplication.use('/api/auth', authRoutes);
        ExpressApplication.use('/api/users', userRoutes);
        ExpressApplication.use('/ap1/market-place', marketPlaceRoutes);
        // ExpressApplication.use('/api/billing', billingRoutes);

        ExpressApplication.use(globalErrorHandler);

        return ExpressApplication;
};

export const ExpressApplication = createExpressApplication(
        authRoutes,
        userRoutes,
        marketPlaceRoutes
        // billingRoutes
);
