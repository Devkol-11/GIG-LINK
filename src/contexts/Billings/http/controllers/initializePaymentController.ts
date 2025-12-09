import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        InitializePaymentUseCase,
        initalizePaymentUseCase
} from '../../application/useCases/initializePaymentUseCase.js';

export class InitializePaymentController {
        constructor(private readonly initializePaymentUseCase: InitializePaymentUseCase) {}

        Execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const walletId = req.body.walletId;
                const email = req.user.email;
                const amount = req.body.amount;

                const response = await this.initializePaymentUseCase.Execute(
                        walletId,
                        email,
                        amount
                );
                return sendResponse(res, httpStatus.Created, response);
        });
}

export const initializePaymentController = new InitializePaymentController(initalizePaymentUseCase);
