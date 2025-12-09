import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        UpdateProfileUseCase,
        updateProfileUseCase
} from '../../application/useCases/UpdateProfileUsecase.js';

export class UpdateProfileHandler {
        constructor(private updateProfileUseCase: UpdateProfileUseCase) {}

        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const userId = req.user.userId;

                        const profileId = req.params.id;

                        const updateProfileData = req.body;

                        const response =
                                await this.updateProfileUseCase.Execute(
                                        userId,
                                        profileId,
                                        updateProfileData
                                );

                        sendResponse(res, httpStatus.Success, response);
                }
        );
}

export const updateProfileHandler = new UpdateProfileHandler(
        updateProfileUseCase
);
