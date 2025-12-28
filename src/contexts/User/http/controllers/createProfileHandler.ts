import { Request, Response, NextFunction } from 'express';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import {
        CreateProfileUseCase,
        createProfileUseCase
} from '../../application/useCases/createProfileUsecase.js';

export class CreateProfileController {
        constructor(private createProfileUseCase: CreateProfileUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const userId = req.user.userId;
                const profile = req.body;

                const response = await this.createProfileUseCase.execute(userId, profile);

                sendResponse(res, httpStatus.Created, response);
        });
}

export const createProfileController = new CreateProfileController(createProfileUseCase);
