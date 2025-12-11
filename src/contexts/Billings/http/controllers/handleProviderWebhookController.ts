import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { PaymentWebHookEvent } from '../../application/dtos/webhookEvent.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { VerifyPaymentWebhookUseCase } from '../../application/useCases/verifyProviderWebhookUseCase.js';

export class HandleProviderWebhook {
        constructor(private readonly verifyPaymentWebhookUseCase: VerifyPaymentWebhookUseCase) {}

        Execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const webhookEvent = req.body.webhookEvent;

                const response = this.verifyPaymentWebhookUseCase.Execute(webhookEvent);

                return sendResponse(res, httpStatus.Success, response);
        });
}
