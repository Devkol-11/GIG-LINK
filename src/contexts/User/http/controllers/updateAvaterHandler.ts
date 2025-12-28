import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { UpdateAvatarUseCase, updateAvatarUseCase } from '../../application/useCases/updateAvatarUsecase.js';

export class UpdateAvatarController {
        constructor(private updateAvatarUseCase: UpdateAvatarUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const userId = req.user.id;

                const { newAvatarUrl } = req.body;

                const response = await this.updateAvatarUseCase.execute(userId, newAvatarUrl);

                sendResponse(res, httpStatus.Success, response);
        });
}

export const updateAvatarController = new UpdateAvatarController(updateAvatarUseCase);
