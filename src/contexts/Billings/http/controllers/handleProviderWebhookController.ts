import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { PaymentWebHookEvent } from '../../application/dtos/webhookEvent.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class HandleProviderWebhook {
        constructor(private readonly handleProviderWebhookUseCase: any) {}

        Execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const signature = req.headers['x-paystack-signature'];
                const rawBody = req.rawBody;

                const response = this.handleProviderWebhookUseCase.Execute(rawBody, signature);

                return sendResponse(res, httpStatus.Success, response);
        });
}
