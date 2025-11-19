import { Request, Response } from "express";
import {
  getPaymentUseCase,
  GetPaymentUseCase,
} from "../../application/useCases/GetPaymentUseCase.js";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";

export class GetPaymentController {
  constructor(private getPaymentUseCase: GetPaymentUseCase) {}

  Execute = catchAsync(async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const response = await this.getPaymentUseCase.execute(paymentId);

    return sendResponse(res, httpStatus.Success, { data: response });
  });
}

export const getPaymentController = new GetPaymentController(getPaymentUseCase);
