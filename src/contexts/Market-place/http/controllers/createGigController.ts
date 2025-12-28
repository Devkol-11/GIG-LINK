import { Request, Response, NextFunction } from 'express';
import { CreateGigUseCase, createGigUseCase } from '../../application/usecases/createGigUseCase.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class CreateGigController {
        constructor(private readonly createGigUseCase: CreateGigUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { title, description, price, category, tags, deadline } = req.body;
                const creatorId = req.user?.userId;

                const gig = await this.createGigUseCase.execute({
                        title,
                        description,
                        price,
                        category,
                        tags,
                        deadline,
                        creatorId
                });

                return sendResponse(res, 200, {
                        message: 'Gig Created successfuly',
                        gig
                });
        });
}

export const createGigController = new CreateGigController(createGigUseCase);
