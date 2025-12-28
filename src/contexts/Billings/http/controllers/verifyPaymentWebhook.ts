import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        VerifyPaymentWebhookUseCase,
        verifyPaymentWebhookUsecase
} from '../../application/useCases/verifyPaymentWebhookWebhookUseCase.js';

export class VerifyPaymentWebhookController {
        constructor(private readonly verifyPaymentWebhookUseCase: VerifyPaymentWebhookUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const webhookEvent = req.body.webhookEvent;

                const response = this.verifyPaymentWebhookUseCase.execute(webhookEvent);

                return sendResponse(res, httpStatus.Success, response);
        });
}

export const verifyPaymentWebhookController = new VerifyPaymentWebhookController(verifyPaymentWebhookUsecase);
