import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../helpers/sendResponse.js';
import { httpStatus } from '../constants/httpStatusCode.js';

const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const allowedProtocols = ['http', 'https'];

export function securePaths(req: Request, res: Response, next: NextFunction) {
        if (!allowedMethods.includes(req.method)) {
                return sendResponse(res, httpStatus.MethodNotAllowed, {
                        error: 'request method not allowed'
                });
        }

        if (!allowedProtocols.includes(req.protocol) && !req.secure) {
                return sendResponse(res, httpStatus.HttpVersionNotSupported, {
                        error: 'protocol must be https'
                });
        }

        // Skip content-type validation for GET and DELETE requests as they typically don't have a body
        if (req.method === 'GET' || req.method === 'DELETE') {
                return next();
        }

        const contentType = req.headers['content-type'];

        if (!contentType || !contentType?.startsWith('application/json')) {
                return sendResponse(res, httpStatus.UnsupportedMedia, {
                        error: 'Unsupported media type, expected application/json'
                });
        }
        next();
}
