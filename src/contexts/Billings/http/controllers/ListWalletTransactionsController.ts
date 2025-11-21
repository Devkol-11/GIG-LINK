import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import {
        ListWalletTransactionsUseCase,
        listWalletTransactionsUseCase
} from '../../application/useCases/ListWalletTranactionsUseCase.js';
import { Request, Response } from 'express';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class ListWalletTransactionsController {
        constructor(
                private listWalletTransactionsUseCase: ListWalletTransactionsUseCase
        ) {}
        Execute = catchAsync(async (req: Request, res: Response) => {
                const walletId = req.params.walletId;

                const data =
                        await this.listWalletTransactionsUseCase.Execute(
                                walletId
                        );

                return sendResponse(res, httpStatus.Success, { data });
        });
}

export const listWalletTransactionsController =
        new ListWalletTransactionsController(listWalletTransactionsUseCase);
