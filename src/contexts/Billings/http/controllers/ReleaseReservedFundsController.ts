import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import {
  releaseReservedFundsUseCase,
  ReleaseReservedFundsUseCase,
} from "../../application/useCases/ReleaseReservedFundsUseCase.js";
import { Request, Response } from "express";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";
import { BadRequest } from "@src/shared/errors/baseErrors.js";

export class ReleaseReservedFundsController {
  constructor(
    private releaseReservedFundsUseCase: ReleaseReservedFundsUseCase
  ) {}

  Execute = catchAsync(async (req: Request, res: Response) => {
    const walletId = req.params.walletId;
    const { amount } = req.body;

    if (typeof amount !== "number")
      throw new BadRequest("Amount must be a number");

    const data = await this.releaseReservedFundsUseCase.Execute(
      walletId,
      amount
    );

    return sendResponse(res, httpStatus.Success, { data });
  });
}

export const releaseReservedFundsController =
  new ReleaseReservedFundsController(releaseReservedFundsUseCase);
