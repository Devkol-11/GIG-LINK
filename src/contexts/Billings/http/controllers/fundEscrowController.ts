import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import {
        FundEscrowAccountUsecase,
        fundEscrowAccountUseCase
} from '../../application/useCases/fundEscrowUseCase.js';

export class FundEscrowAccountController {
        constructor(private readonly fundEscrowAccountUseCase: FundEscrowAccountUsecase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const escrowId = req.params['escrowId'];
                const amount = req.body['amount'];
                const userId = req.user['userId'];

                const response = await this.fundEscrowAccountUseCase.execute(escrowId, amount, userId);

                return sendResponse(res, httpStatus.Success, response);
        });
}

export const fundEscrowAccountController = new FundEscrowAccountController(fundEscrowAccountUseCase);
