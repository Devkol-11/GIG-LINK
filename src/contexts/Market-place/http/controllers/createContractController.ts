import { Request, Response, NextFunction } from 'express';
import {
        CreateContractUseCase,
        createContractUseCase
} from '../../application/usecases/createContractUsecase.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';

export class CreateContractController {
        constructor(
                private readonly createContractUseCase: CreateContractUseCase
        ) {}

        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const applicationId = req.params.applicationId;
                        const creatorId = req.user?.userId;

                        const contract =
                                await this.createContractUseCase.Execute(
                                        applicationId,
                                        creatorId
                                );

                        return sendResponse(res, 201, {
                                message: 'Contract created successfully',
                                contract
                        });
                }
        );
}

export const createContractController = new CreateContractController(
        createContractUseCase
);
