import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        WithdrawalRequestUseCase,
        withdrawalRequestUseCase
} from '../../application/useCases/withdrawRequestUseCase.js';

export class WithdrawalRequestController {
        constructor(private readonly withdrawalRequestUseCase: WithdrawalRequestUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { amount, bankCode, accountNumber } = req.body;
                const { userId, firstName } = req.user;

                const response = await this.withdrawalRequestUseCase.execute({
                        name: firstName,
                        userId,
                        amount,
                        accountNumber,
                        bankCode
                });

                return sendResponse(res, httpStatus.Success, response);
        });
}

export const withdrawalRequestController = new WithdrawalRequestController(withdrawalRequestUseCase);
