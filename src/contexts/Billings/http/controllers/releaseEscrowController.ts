import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import {
        ReleaseEscrowUseCase,
        releaseEscrowUseCase
} from '../../application/useCases/releaseEscrowUseCase.js';

export class ReleaseEscrowController {
        constructor(private readonly releaseEscrowUseCase: ReleaseEscrowUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const escrowId = req.params.escrowId;
                const userId = req.user.userId;

                const response = await this.releaseEscrowUseCase.execute(escrowId, userId);

                return sendResponse(res, httpStatus.Success, response);
        });
}

export const releaseEscrowController = new ReleaseEscrowController(releaseEscrowUseCase);
