import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import {
  getTransactionsByPaymentUseCase,
  GetTransactionsByPaymentUseCase,
} from "../../application/useCases/GetTransactionsByPaymentUseCase.js";
import { Request, Response } from "express";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";

export class GetTransactionsByPaymentController {
  constructor(
    private getTransactionsByPaymentUseCase: GetTransactionsByPaymentUseCase
  ) {}

  Execute = catchAsync(async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;

    const data = await this.getTransactionsByPaymentUseCase.Execute(paymentId);

    return sendResponse(res, httpStatus.Success, { data });
  });
}

export const getTransactionsByPaymentController =
  new GetTransactionsByPaymentController(getTransactionsByPaymentUseCase);
