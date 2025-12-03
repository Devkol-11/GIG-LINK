import { Request, Response, NextFunction } from 'express';
import {
        DeleteGigUseCase,
        deleteGigUseCase
} from '../../application/usecases/deleteGigUseCase.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';

export class DeleteGigController {
        constructor(private readonly deleteGigUseCase: DeleteGigUseCase) {}

        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const { id } = req.params;
                        const creatorId = req.user.userId;

                        await this.deleteGigUseCase.Execute(id, creatorId);

                        return sendResponse(res, 200, {
                                message: 'Gig deleted successfully'
                        });
                }
        );
}

export const deleteGigController = new DeleteGigController(deleteGigUseCase);
