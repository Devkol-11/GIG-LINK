import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { GetContractUseCase, getContractUseCase } from '../../application/usecases/getContractUseCase.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class GetContractController {
        constructor(private getContractUseCase: GetContractUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { userId } = req.user;
                const { contractId } = req.params;
                const { role } = req.user;

                const response = this.getContractUseCase.execute(userId, role, contractId);
                return sendResponse(res, httpStatus.Success, {
                        message: 'Successful',
                        response
                });
        });
}

export const getContractController = new GetContractController(getContractUseCase);
