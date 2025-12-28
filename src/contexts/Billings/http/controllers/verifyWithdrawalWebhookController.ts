import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        verifyWithdrawalWebhookUseCase,
        VerifyWithdrawalWebhookUseCase
} from '../../application/useCases/verifyWithdrawalWebhookUseCase.js';

export class VerifyWithdrawalWebhookController {
        constructor(private readonly verifyWithdrawalWebhookController: VerifyWithdrawalWebhookUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {});
}

export const verifyWithdrawalWebhookController = new VerifyWithdrawalWebhookController(
        verifyWithdrawalWebhookUseCase
);
