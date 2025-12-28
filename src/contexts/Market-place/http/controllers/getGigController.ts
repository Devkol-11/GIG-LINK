import { Request, Response, NextFunction } from 'express';
import { GetGigUseCase, getGigUseCase } from '../../application/usecases/getGigUseCase.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class GetGigController {
        constructor(private readonly getGigUseCase: GetGigUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { id } = req.params;

                const gig = await this.getGigUseCase.execute(id);

                return sendResponse(res, httpStatus.Success, {
                        message: 'Gig fetched successfully',
                        gig
                });
        });
}

export const getGigController = new GetGigController(getGigUseCase);
