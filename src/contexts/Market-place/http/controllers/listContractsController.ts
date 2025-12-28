import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import {
        ListContractsUseCase,
        listContractsUseCase
} from '../../application/usecases/listContractsUseCase.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class ListContractController {
        constructor(private listContractsUseCase: ListContractsUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const userId = req.user?.userId;
                const role = req.user?.role;

                const response = await this.listContractsUseCase.execute(userId, role);

                return sendResponse(res, httpStatus.Success, {
                        response
                });
        });
}

export const listContractsController = new ListContractController(listContractsUseCase);
