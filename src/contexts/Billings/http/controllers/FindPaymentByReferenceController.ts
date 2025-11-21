import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import {
        findPaymentByReferenceUseCase,
        FindPaymentByReferenceUseCase
} from '../../application/useCases/FindPaymentByReferenceUseCase.js';
import { Request, RequestHandler, Response } from 'express';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';

export class FindPaymentReferenceController {
        constructor(
                private findPaymentByReferenceUseCase: FindPaymentByReferenceUseCase
        ) {}

        Execute = catchAsync(async (req: Request, res: Response) => {
                const reference = req.params.reference;
                const data =
                        await this.findPaymentByReferenceUseCase.Execute(
                                reference
                        );
                return sendResponse(res, httpStatus.Success, { data });
        });
}

export const findPaymentByReferenceController =
        new FindPaymentReferenceController(findPaymentByReferenceUseCase);
