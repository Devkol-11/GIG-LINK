import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import {
        GetWalletUseCase,
        getWalletUseCase
} from '../../application/useCases/GetWalletUseCase.js';
import { Request, Response } from 'express';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class GetWalletController {
        constructor(private getWalletUseCase: GetWalletUseCase) {}

        Execute = catchAsync(async (req: Request, res: Response) => {
                const walletId = req.params.walletId;

                const data = await this.getWalletUseCase.Execute(walletId);

                return sendResponse(res, httpStatus.Success, { data });
        });
}

export const getWalletController = new GetWalletController(getWalletUseCase);
