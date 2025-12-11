import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { VerifyPaymentStatusUseCase } from '../../application/useCases/verifyPaymentStatusUseCase.js';

export class VerifyPaymentStatusController {
        constructor(private readonly verifyPaymentStatusUseCase: VerifyPaymentStatusUseCase) {}

        Execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const systemReference = req.body.systemReference;

                const response = await this.verifyPaymentStatusUseCase.Execute(systemReference);

                return sendResponse(res, httpStatus.Success, response);
        });
}
