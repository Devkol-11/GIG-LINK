import { admin_user_Services } from '../services/admin_user_services.js';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';

import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class Admin_user_Controllers {
        deleteUser = catchAsync(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
                const { userId } = req.params;
                const result = await admin_user_Services.deleteUser(userId);
                return sendResponse(res, httpStatus.Success, result);
        });
}

export const admin_user_Controllers = new Admin_user_Controllers();
