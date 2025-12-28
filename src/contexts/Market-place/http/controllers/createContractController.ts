import { Request, Response, NextFunction } from 'express';
import {
        CreateContractUseCase,
        createContractUseCase
} from '../../application/usecases/createContractUsecase.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';

export class CreateContractController {
        constructor(private readonly createContractUseCase: CreateContractUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const applicationId = req.params.applicationId;
                const creatorId = req.user.userId;

                const contract = await this.createContractUseCase.execute(applicationId, creatorId);

                return sendResponse(res, 201, {
                        message: 'Contract created successfully',
                        contract
                });
        });
}

export const createContractController = new CreateContractController(createContractUseCase);
