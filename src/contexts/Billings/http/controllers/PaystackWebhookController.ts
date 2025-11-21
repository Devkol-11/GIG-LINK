import { Request, Response } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        paystackWebhookHandlerUseCase,
        PaystackWebhookHandlerUseCase
} from '../../application/useCases/PaystackWebhookUseCase.js';

export class PaystackWebhookController {
        constructor(private webhookHandler: PaystackWebhookHandlerUseCase) {}

        handlePaystackWebhook = catchAsync(
                async (req: Request, res: Response) => {
                        const signature = req.headers[
                                'x-paystack-signature'
                        ] as string;
                        const rawBody = (req as any).rawBody;

                        await this.webhookHandler.execute(rawBody, signature);

                        return sendResponse(res, httpStatus.Success, {
                                status: 'ok'
                        });
                }
        );
}

export const paystackWebhookController = new PaystackWebhookController(
        paystackWebhookHandlerUseCase
);
