import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        PaymentRequestUseCase,
        paymentRequestUseCase
} from '../../application/useCases/paymentRequestUseCase.js';

export class PaymentRequestController {
        constructor(private readonly paymentRequestUseCase: PaymentRequestUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const walletId = req.body.walletId;
                const email = req.user.email;
                const amount = req.body.amount;

                const response = await this.paymentRequestUseCase.execute(walletId, email, amount);
                return sendResponse(res, httpStatus.Created, response);
        });
}

export const paymentRequestController = new PaymentRequestController(paymentRequestUseCase);
