import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { NextFunction, Request, Response } from "express";
import {
  fundWalletUseCase,
  FundWalletUseCase,
} from "../../application/useCases/FundWalletUseCase.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";

export class FundWalletController {
  constructor(private readonly fundWalletUseCase: FundWalletUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { amount, currency, channel, email } = req.body;
      const walletId = req.params.walletId;
      const userId = req.user?.userId;

      if (!userId) {
        sendResponse(res, httpStatus.Unauthorized, "unauthorized");
      }
      const response = await this.fundWalletUseCase.Execute(
        walletId,
        userId,
        Number(amount),
        email,
        { currency, channel }
      );

      return sendResponse(res, 200, {
        status: "success",
        data: response,
      });
    }
  );
}

export const fundWalletController = new FundWalletController(fundWalletUseCase);
