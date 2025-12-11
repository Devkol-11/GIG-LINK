import Express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { securePaths } from './shared/middlewares/secure.paths.js';

import { authRoutes } from '@src/contexts/Auth/http/routes/AuthRoutes.js';
import { userRoutes } from '@src/contexts/User/http/routes/UserRoutes.js';
import { marketplaceRoutes } from '@src/contexts/Market-place/http/routes/marketPlaceRoutes.js';
import { billingRoutes } from '@src/contexts/Billings/http/routes/billingRoutes.js';

import { globalErrorHandler } from '@src/shared/middlewares/globalErrorHandler.js';

export const ExpressApplication = Express();

ExpressApplication.use(securePaths);
// Body parser
ExpressApplication.use(Express.json());

// Security and logging
ExpressApplication.use(morgan('dev'));
ExpressApplication.use(helmet());

// Routes
ExpressApplication.use('/api/v1/auth', authRoutes);
ExpressApplication.use('/api/v1/users', userRoutes);
ExpressApplication.use('/api/v1/market-place', marketplaceRoutes);
// ExpressApplication.use('/api/v1/billing', billingRoutes);

// Global error handler
ExpressApplication.use(globalErrorHandler);
