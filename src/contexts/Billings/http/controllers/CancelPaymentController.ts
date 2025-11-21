import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import {
        cancelPaymentUseCase,
        CancelPaymentUseCase
} from '../../application/useCases/CancelPaymentUseCase.js';
import { Request, Response } from 'express';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class CancelPaymentController {
        constructor(private cancelPaymentUseCase: CancelPaymentUseCase) {}

        Execute = catchAsync(async (req: Request, res: Response) => {
                const paymentId = req.params.id;
                const { reason } = req.body;

                const data = await this.cancelPaymentUseCase.execute(
                        paymentId,
                        reason
                );

                return sendResponse(res, httpStatus.Success, { data });
        });
}

export const cancelPaymentController = new CancelPaymentController(
        cancelPaymentUseCase
);
