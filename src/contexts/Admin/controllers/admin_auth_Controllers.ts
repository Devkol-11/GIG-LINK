import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { AdminRegistrationRequest, AdminLoginRequest } from '../dto/types.js';
import { admin_auth_Services } from '../services/admin_auth_Services.js';

export class Admin_auth_Controllers {
        registerAdmin = catchAsync(
                async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
                        const { firstName, lastName, password, email } = req.body as AdminRegistrationRequest;

                        const { message, accessToken, refreshToken } =
                                await admin_auth_Services.registerAdmin({
                                        firstName,
                                        lastName,
                                        email,
                                        password
                                });

                        const response = { message, accessToken };

                        return sendResponse(res, httpStatus.Success, response, refreshToken);
                }
        );

        loginAdmin = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { email, password } = req.body as AdminLoginRequest;

                const { message, accessToken, refreshToken } = await admin_auth_Services.login({
                        email,
                        password
                });

                const response = { message, accessToken };

                return sendResponse(res, httpStatus.Success, response, refreshToken);
        });

        logoutAdmin = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { refreshToken } = req.body;

                const { message } = await admin_auth_Services.logout(refreshToken);

                return sendResponse(res, httpStatus.Success, { message });
        });
}

export const admin_auth_Controllers = new Admin_auth_Controllers();
