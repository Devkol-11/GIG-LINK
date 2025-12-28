import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { NextFunction, Request, Response } from 'express';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export function interceptRequiredFields(
        req: Request,
        res: Response,
        next: NextFunction
) {
        const body = req.body;

        if (!body.email) {
                return sendResponse(res, httpStatus.BadRequest, {
                        message: 'email required'
                });
        }

        if (!body.password) {
                return sendResponse(res, httpStatus.BadRequest, {
                        message: 'password required'
                });
        }

        if (!body.firstName) {
                return sendResponse(res, httpStatus.BadRequest, {
                        message: 'firstName required'
                });
        }

        if (!body.lastName) {
                return sendResponse(res, httpStatus.BadRequest, {
                        message: 'lastName required'
                });
        }

        if (!body.phoneNumber) {
                return sendResponse(res, httpStatus.BadRequest, {
                        message: 'phoneNumber required'
                });
        }

        next();
}
