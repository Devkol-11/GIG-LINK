import { Request, Response, NextFunction } from 'express';
import { UpdateGigUseCase, updateGigUseCase } from '../../application/usecases/updateGigUseCase.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class UpdateGigController {
        constructor(private readonly updateGigUseCase: UpdateGigUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const gigId = req.params.id;
                const updates = req.body;
                const userId = req.user?.userId;

                const response = await this.updateGigUseCase.execute(gigId, updates, userId);

                return sendResponse(res, httpStatus.Success, {
                        message: 'Gig updated successfully',
                        gig: response
                });
        });
}

export const updateGigController = new UpdateGigController(updateGigUseCase);
