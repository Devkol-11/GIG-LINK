import { Request, Response, NextFunction } from 'express';
import { DeleteGigUseCase, deleteGigUseCase } from '../../application/usecases/deleteGigUseCase.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class DeleteGigController {
        constructor(private readonly deleteGigUseCase: DeleteGigUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { id } = req.params;
                const creatorId = req.user.userId;

                await this.deleteGigUseCase.execute(id, creatorId);

                return sendResponse(res, httpStatus.Success, {
                        message: 'Gig deleted successfully'
                });
        });
}

export const deleteGigController = new DeleteGigController(deleteGigUseCase);
