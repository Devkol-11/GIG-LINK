import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import {
  GetWalletPaymentsUseCase,
  getWalletPaymentsUseCase,
} from "../../application/useCases/GetWalletPaymentsUseCase.js";
import { Request, Response } from "express";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";

export class GetWalletPaymentsController {
  constructor(private getWalletPaymentUseCase: GetWalletPaymentsUseCase) {}

  Execute = catchAsync(async (req: Request, res: Response) => {
    const walletId = req.params.walletId;

    const data = await this.getWalletPaymentUseCase.Execute(walletId);

    return sendResponse(res, httpStatus.Success, { data });
  });
}

export const getWalletPaymentsController = new GetWalletPaymentsController(
  getWalletPaymentsUseCase
);
