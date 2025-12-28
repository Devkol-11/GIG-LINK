import Express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infrastructure/Swagger/swagger.js';
import { securePaths } from './shared/middlewares/secure.paths.js';
import { userRoutes } from './contexts/User/http/routes/UserRoutes.js';
import { authRoutes } from '@src/contexts/User/http/routes/AuthRoutes.js';
import { marketplaceRoutes } from '@src/contexts/Market-place/http/routes/marketPlaceRoutes.js';
import { billingRoutes } from '@src/contexts/Billings/http/routes/billingRoutes.js';

import { globalErrorHandler } from '@src/shared/middlewares/globalErrorHandler.js';

export const ExpressApplication = Express();

// CORS Configuration - Allow requests from frontend
ExpressApplication.use(
        cors({
                origin: process.env.FRONTEND_URL || '*',
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                allowedHeaders: ['Content-Type', 'Authorization']
        })
);

// Request size limits
ExpressApplication.use(Express.json({ limit: '10mb' }));
ExpressApplication.use(Express.urlencoded({ limit: '10mb', extended: true }));

// Security middleware
ExpressApplication.use(securePaths);

// Security and logging
ExpressApplication.use(morgan('dev'));
ExpressApplication.use(helmet());

// Swagger Documentation
ExpressApplication.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
                swaggerOptions: {
                        deepLinking: true,
                        layout: 'BaseLayout'
                },
                customCss: '.swagger-ui .topbar { display: none }'
        })
);

// Routes
ExpressApplication.use('/api/v1/auth', authRoutes);
ExpressApplication.use('/api/v1/users', userRoutes);
ExpressApplication.use('/api/v1/market-place', marketplaceRoutes);
ExpressApplication.use('/api/v1/billing', billingRoutes);

// Global error handler
ExpressApplication.use(globalErrorHandler);
