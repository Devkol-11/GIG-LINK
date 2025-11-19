import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import {
  GetWalletByUserUseCase,
  getWalletByUserUseCase,
} from "../../application/useCases/GetWalletByUserUseCase.js";
import { Request, Response } from "express";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";

export class GetWalletByUserController {
  constructor(private getWalletByUserUseCase: GetWalletByUserUseCase) {}

  Execute = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const data = await this.getWalletByUserUseCase.Execute(userId);

    return sendResponse(res, httpStatus.Success, { data });
  });
}

export const getWalletByUserController = new GetWalletByUserController(
  getWalletByUserUseCase
);
