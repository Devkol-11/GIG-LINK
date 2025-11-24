import { Request, Response, NextFunction } from 'express';
import { logger } from '@src/core/logging/winston.js';
import { sendError } from '../helpers/sendError.js';
import { HttpError } from '../errors/httpError.js';
import { BusinessError } from '../errors/BusinessError.js';
import { ConcurrencyError } from '@src/contexts/Billings/domain/errors/concurrencyError.js';

export const globalErrorHandler = (
        err: Error & BusinessError & ConcurrencyError & HttpError,
        _req: Request,
        res: Response,
        _next: NextFunction
) => {
        logger.error(err);

        if (err.isBusinessError || (err.statusCode && err.statusCode < 500)) {
                const statusCode = err.statusCode || 400;

                return sendError(res, statusCode, {
                        message: err.message,
                        err: {
                                statusCode: err.statusCode,
                                name: err.name,
                                stackTrace: err.stack
                        }
                });
        }

        if (
                err.isConcurrencyError ||
                (err.statusCode && err.statusCode < 500)
        ) {
                const statusCode = err.statusCode;

                return sendError(res, statusCode, {
                        message: err.message,
                        error: {
                                statusCode: err.statusCode,
                                name: err.name,
                                stackTrace: err.stack
                        }
                });
        }

        if (err.isHttpError) {
                return sendError(res, err.statusCode, {
                        message: err.message,
                        err: {
                                statusCode: err.statusCode,
                                name: err.name,
                                stackTrace: err.stack
                        }
                });
        }

        return sendError(res, 500, {
                message: 'Internal Server Error',
                err: err,
                stack: err.stack
        });
};
