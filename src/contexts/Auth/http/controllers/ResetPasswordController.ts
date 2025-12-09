import { Request, Response, NextFunction } from 'express';
import {
        ResetPasswordUseCase,
        resetPasswordUseCase
} from '../../application/useCases/ResetPasswordUseCase.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class ResetPasswordController {
        constructor(private resetPasswordUseCase: ResetPasswordUseCase) {}

        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const { otp, password } = req.body;
                        const response =
                                await this.resetPasswordUseCase.Execute(
                                        otp,
                                        password
                                );
                        return sendResponse(res, httpStatus.Success, response);
                }
        );
}

export const resetPasswordController = new ResetPasswordController(
        resetPasswordUseCase
);
