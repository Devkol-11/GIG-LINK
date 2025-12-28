import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        ListWalletPaymentUseCase,
        listWalletPaymentsUseCase
} from '../../application/useCases/listWalletPaymentsUseCase.js';

export class ListWalletPaymentController {
        constructor(private readonly listWalletPaymentUseCase: ListWalletPaymentUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const walletId = req.params.walletId;

                const response = await this.listWalletPaymentUseCase.execute(walletId);

                return sendResponse(res, httpStatus.Success, response);
        });
}

export const listWalletPaymentController = new ListWalletPaymentController(listWalletPaymentsUseCase);
