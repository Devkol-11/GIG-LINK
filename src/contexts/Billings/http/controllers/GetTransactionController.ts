import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import {
  getTransactionUseCase,
  GetTransactionUseCase,
} from "../../application/useCases/GetTransactionUseCase.js";
import { Request, Response } from "express";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";

export class GetTransactionController {
  constructor(private getTransactionUseCase: GetTransactionUseCase) {}

  Execute = catchAsync(async (req: Request, res: Response) => {
    const transactionId = req.params.transactionId;

    const data = await this.getTransactionUseCase.Execute(transactionId);

    return sendResponse(res, httpStatus.Success, { data });
  });
}

export const getTransactionController = new GetTransactionController(
  getTransactionUseCase
);
