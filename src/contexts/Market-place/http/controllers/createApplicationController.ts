import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import {
        CreateApplicationUseCase,
        createApplicationUseCase
} from '../../application/usecases/createApplicationUseCase.js';

export class CreateApplicationController {
        constructor(
                private createApplicationUseCase: CreateApplicationUseCase
        ) {}

        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const gigId = req.params.id;
                        const freelancerId = req.user?.userId;

                        const coverLetter = req.body.coverLetter;

                        const response = this.createApplicationUseCase.Execute({
                                gigId,
                                freelancerId,
                                coverLetter
                        });

                        return sendResponse(res, 200, {
                                message: 'Application creation Successful',
                                response
                        });
                }
        );
}

export const createApplicationController = new CreateApplicationController(
        createApplicationUseCase
);
