import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import {
        ListContractsUseCase,
        listContractsUseCase
} from '../../application/usecases/listContractsUseCase.js';

export class ListContractController {
        constructor(private listContractsUseCase: ListContractsUseCase) {}

        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const userId = req.user?.userId;
                        const role = req.user?.role;

                        const response =
                                await this.listContractsUseCase.Execute(
                                        userId,
                                        role
                                );

                        return sendResponse(res, 200, {
                                response
                        });
                }
        );
}

export const listContractsController = new ListContractController(
        listContractsUseCase
);
