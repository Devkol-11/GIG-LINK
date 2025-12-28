import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import {
        GetEscrowAccountTransactionUseCase,
        getEscrowAccountTransactionUseCase
} from '../../application/useCases/getEscrowTransactionUseCase.js';

export class GetEscrowAccountTransactionController {
        constructor(
                private readonly getEscrowAccountTransactionUseCase: GetEscrowAccountTransactionUseCase
        ) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const transactionId = req.body.escrowAccountTransactionId;

                const response = await this.getEscrowAccountTransactionUseCase.execute(transactionId);

                return sendResponse(res, httpStatus.Success, response);
        });
}

export const getEscrowAccountTransactionController = new GetEscrowAccountTransactionController(
        getEscrowAccountTransactionUseCase
);
