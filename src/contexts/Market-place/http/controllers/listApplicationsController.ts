import { Request, Response, NextFunction } from 'express';
import {
        ListApplicationsUseCase,
        listApplicationsUseCase
} from '../../application/usecases/listApplicationsUseCase.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class ListApplicationsController {
        constructor(private readonly listApplicationsUseCase: ListApplicationsUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const userId = req.user?.userId;
                const role = req.user?.role;

                const { applications, total, page, totalPages } = await this.listApplicationsUseCase.execute(
                        userId,
                        role
                );

                return sendResponse(res, httpStatus.Success, {
                        message: 'Applications fetched successfully',
                        count: applications.length,
                        applications,
                        total,
                        page,
                        totalPages
                });
        });
}

export const listApplicationsController = new ListApplicationsController(listApplicationsUseCase);
