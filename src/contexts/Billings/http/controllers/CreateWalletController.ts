import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import {
        CreateWalletUseCase,
        createWalletUseCase
} from '../../application/useCases/CreateWalletUseCase.js';
import { Request, Response } from 'express';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class CreateWalletController {
        constructor(private createWalletUseCase: CreateWalletUseCase) {}

        Execute = catchAsync(async (req: Request, res: Response) => {
                const userId = req.body.userId;

                const data = await this.createWalletUseCase.Execute(userId);

                return sendResponse(res, httpStatus.Created, { data });
        });
}

export const createWalletController = new CreateWalletController(
        createWalletUseCase
);
