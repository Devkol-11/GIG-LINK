import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import {
        listTransactionsByQueryUsecase,
        ListTransactionsByQueryUseCase
} from '../../application/useCases/ListTransactionsByQueryUseCase.js';
import { Request, Response } from 'express';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class ListTransactionsByQueryController {
        constructor(
                private listTransactionsByQueryUsecase: ListTransactionsByQueryUseCase
        ) {}

        Execute = catchAsync(async (req: Request, res: Response) => {
                const walletId = req.params.walletId;

                // Helper to safely cast query params to string
                const toStringOrUndefined = (
                        value: any
                ): string | undefined => {
                        if (!value) return undefined;
                        if (Array.isArray(value)) return String(value[0]);
                        return String(value);
                };

                // Safe conversions
                const startDateStr = toStringOrUndefined(req.query.startDate);
                const endDateStr = toStringOrUndefined(req.query.endDate);
                const status = toStringOrUndefined(req.query.status);
                const type = toStringOrUndefined(req.query.type);

                // Convert into Dates only if they exist
                const filters = {
                        startDate: startDateStr
                                ? new Date(startDateStr)
                                : undefined,
                        endDate: endDateStr ? new Date(endDateStr) : undefined,
                        status,
                        type
                };

                const transactions =
                        await this.listTransactionsByQueryUsecase.execute(
                                walletId,
                                filters
                        );

                return sendResponse(res, httpStatus.Success, {
                        data: transactions
                });
        });
}

export const listTransactionsByQueryController =
        new ListTransactionsByQueryController(listTransactionsByQueryUsecase);
