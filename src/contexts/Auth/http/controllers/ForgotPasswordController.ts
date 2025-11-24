import { Request, Response, NextFunction } from 'express';
import {
        ForgotPasswordUseCase,
        forgotPasswordUseCase
} from '../../application/useCases/ForgotPasswordUseCase.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';

export class ForgotPasswordController {
        constructor(private forgotPasswordUseCase: ForgotPasswordUseCase) {}

        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const { email } = req.body;

                        const response =
                                await this.forgotPasswordUseCase.Execute(email);

                        return sendResponse(res, httpStatus.Success, response);
                }
        );
}

export const forgotPasswordController = new ForgotPasswordController(
        forgotPasswordUseCase
);
